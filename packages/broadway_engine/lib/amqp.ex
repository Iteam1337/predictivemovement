defmodule AMQP do
  def wait_for_messages(_channel, correlation_id) do
    receive do
      {:basic_deliver, payload, %{correlation_id: ^correlation_id}} ->
        payload
    end
  end

  def call(data) do
    {:ok, connection} = AMQP.Connection.open()
    {:ok, channel} = AMQP.Channel.open(connection)
    reply_queue = "p_response"

    {:ok, %{queue: _queue_name}} =
      AMQP.Queue.declare(
        channel,
        reply_queue
      )

    AMQP.Basic.consume(channel, reply_queue, nil, no_ack: true)

    correlation_id =
      :erlang.unique_integer()
      |> :erlang.integer_to_binary()
      |> Base.encode64()

    request = Poison.encode!(data)

    AMQP.Basic.publish(
      channel,
      "",
      "pickup_offers",
      request,
      reply_to: reply_queue,
      correlation_id: correlation_id
    )

    wait_for_messages(channel, correlation_id)
  end
end
