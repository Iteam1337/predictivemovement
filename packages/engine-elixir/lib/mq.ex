defmodule MQ do
  def publish(data, queue_name) do
    {:ok, connection} = AMQP.Connection.open(Application.fetch_env!(:engine, :amqp_host))
    {:ok, channel} = AMQP.Channel.open(connection)
    AMQP.Queue.declare(channel, queue_name)

    AMQP.Basic.publish(channel, "", queue_name, Poison.encode!(data),
      content_type: "application/json"
    )

    AMQP.Connection.close(connection)
  end

  # def publishExchange(exchange, data) do
  #   {:ok, connection} = AMQP.Connection.open(Application.fetch_env!(:engine, :amqp_host))
  #   {:ok, channel} = AMQP.Channel.open(connection)
  #   AMQP.Exchange.declare(channel, exchange, :fanout)
  #   AMQP.Basic.publish(channel, exchange, "", Poison.encode!(data), content_type: "application/json")
  #   AMQP.Connection.close(connection)
  # end

  # THIS DOES NOT WORK PROPERLY, USE AT OWN RISK
  # def subscribe(queue) do
  #   {:ok, connection} = AMQP.Connection.open()
  #   {:ok, channel} = AMQP.Channel.open(connection)
  #   AMQP.Queue.declare(channel, queue)

  #   AMQP.Basic.consume(
  #     channel,
  #     queue,
  #     nil
  #   )
  # end
  def wait_for_messages(_channel, correlation_id) do
    receive do
      {:basic_deliver, payload, %{correlation_id: ^correlation_id}} ->
        payload
    end
  end

  def publish_rpc(data, queue_name) do
    {:ok, connection} = AMQP.Connection.open()
    {:ok, channel} = AMQP.Channel.open(connection)

    AMQP.Queue.declare(
      channel,
      queue_name
    )

    AMQP.Basic.consume(channel, queue_name, nil, no_ack: true)

    correlation_id =
      :erlang.unique_integer()
      |> :erlang.integer_to_binary()
      |> Base.encode64()

    AMQP.Basic.publish(
      channel,
      "",
      "rpc_queue",
      Poison.encode!(data),
      reply_to: queue_name,
      correlation_id: correlation_id
    )

    wait_for_messages(channel, correlation_id)
  end
end
