defmodule BookingRequests do
  def init do
    parent = self()

    Stream.resource(
      fn ->
        spawn(fn ->
          queue_name = "booking_requests"
          # Application.fetch_env!(:engine, :bookings_exchange)
          bookings_exchange = "bookings"
          {:ok, connection} = AMQP.Connection.open(Application.fetch_env!(:engine, :amqp_host))
          {:ok, channel} = AMQP.Channel.open(connection)
          AMQP.Exchange.declare(channel, bookings_exchange, :topic)
          AMQP.Queue.declare(channel, queue_name)
          AMQP.Queue.bind(channel, queue_name, bookings_exchange, routing_key: "new")

          AMQP.Queue.subscribe(channel, queue_name, fn booking, _meta ->
            send(parent, {:msg, booking: booking |> Poison.decode!(%{keys: :atoms})})
          end)
        end)
      end,
      fn pid -> receive_next_value(pid) end,
      fn values -> values end
    )
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
