defmodule RpcServer do
  # def wait_for_messages(channel) do
  #   receive do
  #     {:basic_deliver, payload, meta} ->
  #       IO.inspect(payload, label: "payload")
  #       %{car: car, booking: booking} = payload |> Poison.decode!(%{keys: :atoms})
  #       response = "Offer booking to car #{car.id}"

  #       AMQP.Basic.publish(
  #         channel,
  #         "",
  #         meta.reply_to,
  #         "#{response}",
  #         correlation_id: meta.correlation_id
  #       )

  #       AMQP.Basic.ack(channel, meta.delivery_tag)

  #       wait_for_messages(channel)
  #   end
  # end

  def init() do
    {:ok, connection} = AMQP.Connection.open()
    {:ok, channel} = AMQP.Channel.open(connection)

    AMQP.Queue.declare(channel, "rpc_queue")
    AMQP.Basic.qos(channel, prefetch_count: 1)

    AMQP.Queue.subscribe(channel, "rpc_queue", fn payload, meta ->
      %{car: car, booking: booking} = payload |> Poison.decode!(%{keys: :atoms})

      response = "Offer booking to car #{car.id}"

      AMQP.Basic.publish(
        channel,
        "",
        meta.reply_to,
        "#{response}",
        correlation_id: meta.correlation_id
      )

      AMQP.Basic.ack(channel, meta.delivery_tag)
    end)

    # AMQP.Basic.consume(channel, "rpc_queue")
    IO.puts(" [x] Awaiting RPC requests")

    # RpcServer.wait_for_messages(channel)
  end
end
