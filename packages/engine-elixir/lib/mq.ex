defmodule MQ do
  def publish(queue, data) do
    {:ok, connection} = AMQP.Connection.open()
    {:ok, channel} = AMQP.Channel.open(connection)
    AMQP.Queue.declare(channel, queue)

    AMQP.Basic.publish(channel, "", queue, Poison.encode!(data),
      content_type: "application/json"
    )

    AMQP.Connection.close(connection)
  end
end
