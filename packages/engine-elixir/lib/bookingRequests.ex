defmodule BookingRequests do
  def init do
    Stream.resource(
      fn -> subscribe(self()) end,
      fn pid -> receive_next_value(pid) end,
      fn values -> values end
    )
  end

  defp decode(booking) do
    booking |> Poison.decode!(%{keys: :atoms})
  end

  defp subscribe(parent) do
    spawn(fn ->
      exchange = "bookings"
      queue = "booking_requests"
      {:ok, connection} = AMQP.Connection.open(Application.fetch_env!(:engine, :amqp_host))
      {:ok, channel} = AMQP.Channel.open(connection)
      AMQP.Exchange.declare(channel, exchange, :topic)
      AMQP.Queue.declare(channel, queue)
      AMQP.Queue.bind(channel, queue, exchange, routing_key: "new")

      AMQP.Queue.subscribe(channel, queue, fn booking, _meta ->
        send(parent, {:msg, booking: decode(booking)})
      end)
    end)
  end

  defp receive_next_value(pid) do
    receive do
      {:msg, booking: booking} ->
        {[booking], pid}

      _ ->
        receive_next_value(pid)
    end
  end
end
