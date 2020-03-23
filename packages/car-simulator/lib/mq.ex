defmodule MQ do
  def publish(exchange, data) do
    {:ok, connection} = AMQP.Connection.open(Application.fetch_env!(:car_simulator, :amqp_host))
    {:ok, channel} = AMQP.Channel.open(connection)
    AMQP.Exchange.declare(channel, exchange, :fanout)
    AMQP.Basic.publish(channel, exchange, "", Poison.encode!(data), content_type: "application/json")
    AMQP.Connection.close(connection)
  end
end
