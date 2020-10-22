defmodule Engine.Adapters.RMQRPCWorker do
  use GenServer
  alias AMQP.{Queue, Channel, Basic}
  alias Engine.Adapters.RMQ

  def init(conn) do
    {:ok, conn}
  end

  def call(data, queue) do
    {:ok, conn} = RMQ.get_connection()

    GenServer.start_link(__MODULE__, conn)
    |> GenServer.call({:call, data, queue})
  end

  def handle_call({:call, data, queue}, _from, conn) do
    {:ok, channel} = Channel.open(conn)

    {:ok, %{queue: queue_name}} =
      Queue.declare(
        channel,
        "",
        exclusive: true,
        auto_delete: true
      )

    Basic.consume(channel, queue_name, nil, no_ack: false)
    IO.puts("Engine wants response from #{queue} to #{queue_name}")

    correlation_id =
      :erlang.unique_integer()
      |> :erlang.integer_to_binary()
      |> Base.encode64()

    Basic.publish(
      channel,
      "",
      queue,
      Jason.encode!(data),
      reply_to: queue_name,
      correlation_id: correlation_id
    )

    wait_for_messages(channel, correlation_id)
  end

  defp wait_for_messages(channel, correlation_id) do
    receive do
      {:basic_deliver, payload, %{correlation_id: ^correlation_id} = msg} ->
        Queue.unsubscribe(channel, Map.get(msg, :consumer_tag))
        payload

      _ ->
        wait_for_messages(channel, correlation_id)
    end
  end

  def handle_info({:basic_cancel_ok, _}, state), do: {:noreply, state}
end
