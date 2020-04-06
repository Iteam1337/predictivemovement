defmodule RpcClient do
  def wait_for_messages(_channel, correlation_id) do
    receive do
      {:basic_deliver, payload, %{correlation_id: ^correlation_id}} ->
        payload
    end
  end

  # def call(n, queue_name) do
  #   {:ok, connection} = AMQP.Connection.open()
  #   {:ok, channel} = AMQP.Channel.open(connection)

  #   AMQP.Queue.declare(
  #     channel,
  #     queue_name,
  #     exclusive: true
  #   )

  #   AMQP.Basic.consume(channel, queue_name, nil, no_ack: true)

  #   correlation_id =
  #     :erlang.unique_integer()
  #     |> :erlang.integer_to_binary()
  #     |> Base.encode64()

  #   request = to_string(n)

  #   AMQP.Basic.publish(
  #     channel,
  #     "",
  #     "rpc_queue",
  #     request,
  #     reply_to: queue_name,
  #     correlation_id: correlation_id
  #   )

  #   RpcClient.wait_for_messages(channel, correlation_id)
  # end

  def call(data, queue_name) do
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
