defmodule PositionCleaner do
  use GenServer
  use AMQP

  def start_link(opts \\ [name: __MODULE__]) do
    GenServer.start_link(__MODULE__, nil, opts)
  end

  @exchange "cars"
  @queue_positions "positions"
  @queue_positions_cleaned "positions_cleaned"

  def init(_opts) do
    {:ok, conn} = Connection.open()
    {:ok, chan} = Channel.open(conn)
    setup_queue(chan)

    {:ok, _consumer_tag} = Basic.consume(chan, @queue_positions)
    {:ok, chan}
  end

  def handle_info({:basic_consume_ok, %{consumer_tag: consumer_tag}}, chan) do
    {:noreply, chan}
  end

  def handle_info({:basic_cancel, %{consumer_tag: consumer_tag}}, chan) do
    {:stop, :normal, chan}
  end

  def handle_info({:basic_cancel_ok, %{consumer_tag: consumer_tag}}, chan) do
    {:noreply, chan}
  end

  def handle_info({:basic_deliver, payload, %{delivery_tag: tag, redelivered: redelivered}}, chan) do
    consume(chan, tag, redelivered, payload |> Poison.decode!(%{keys: :atoms}))
    {:noreply, chan}
  end

  defp setup_queue(chan) do
    {:ok, _} = Queue.declare(chan, @queue_positions, durable: false)
    :ok = Exchange.fanout(chan, @exchange, durable: false)
    :ok = Queue.bind(chan, @queue_positions, @exchange)
  end

  defp consume(channel, tag, redelivered, payload) do
    %{waypoints: [head | _] } = Osrm.nearest(payload |> Map.get(:position))

    Basic.publish channel, "", @queue_positions_cleaned, Poison.encode!(payload |> Map.put(:position, %{lat: Enum.at(head.location, 1), lon: Enum.at(head.location, 0)}))
    :ok = Basic.ack channel, tag
  rescue
    exception ->
      :ok = Basic.reject channel, tag, requeue: not redelivered
  end
end