defmodule Booking do
  def publish(booking) do
    {:ok, connection} = AMQP.Connection.open()
    {:ok, channel} = AMQP.Channel.open(connection)
    queue = "bookings"
    AMQP.Queue.declare(channel, queue)
    AMQP.Basic.publish(channel, "", queue, Poison.encode!(booking), content_type: "application/json")
    IO.puts(" [x] Sent 'Hello World!'")
    AMQP.Connection.close(connection)
  end
end
