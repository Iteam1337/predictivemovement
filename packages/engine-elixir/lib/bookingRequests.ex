defmodule BookingRequests do
  def init do
    IO.puts("Initialize the stream for booking requests")

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
    IO.puts("Subscribe for bookings")

    spawn(fn ->
      exchange = "bookings"
      queue = "booking_requests"
      IO.puts("Now we create a #{queue} for bookings exchange")
      {:ok, connection} = AMQP.Connection.open(Application.fetch_env!(:engine, :amqp_host))
      {:ok, channel} = AMQP.Channel.open(connection)
      AMQP.Exchange.declare(channel, exchange, :topic)
      AMQP.Queue.declare(channel, queue)
      AMQP.Queue.bind(channel, queue, exchange, routing_key: "new")
      IO.puts("Now we bound the #{queue} to bookings exchange")

      AMQP.Queue.subscribe(channel, queue, fn booking, _meta ->
        IO.puts("Now we have a message from booking_requests queue")
        booking_decoded = decode(booking)
        IO.puts("Got info about booking #{booking_decoded.id}")
        send(parent, {:msg, booking: booking_decoded})
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
