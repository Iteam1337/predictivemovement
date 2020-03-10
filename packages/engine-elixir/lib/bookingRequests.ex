defmodule BookingRequests do
  def init do
    parent = self()

    Stream.resource(
      fn ->
        spawn(fn ->
          queue = "simulated_bookings"
          {:ok, connection} = AMQP.Connection.open()
          {:ok, channel} = AMQP.Channel.open(connection)
          AMQP.Queue.declare(channel, queue)

          AMQP.Queue.subscribe(channel, queue, fn booking, _meta ->
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
