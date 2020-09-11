defmodule MQ do
  def amqp_url, do: "amqp://" <> Application.fetch_env!(:engine, :amqp_host)

  @incoming_vehicle_exchange Application.compile_env!(:engine, :incoming_vehicle_exchange)
  @incoming_booking_exchange Application.compile_env!(:engine, :incoming_booking_exchange)
  @outgoing_vehicle_exchange Application.compile_env!(:engine, :outgoing_vehicle_exchange)
  @outgoing_booking_exchange Application.compile_env!(:engine, :outgoing_booking_exchange)
  @outgoing_plan_exchange Application.compile_env!(:engine, :outgoing_plan_exchange)

  def init() do
    create_outgoing_exchanges()
  end

  def wait_for_messages(channel, correlation_id) do
    receive do
      {:basic_deliver, payload, %{correlation_id: ^correlation_id}} ->
        payload

      _ ->
        wait_for_messages(channel, correlation_id)
    end
  end

  def call(data, queue) do
    {:ok, connection} = AMQP.Connection.open(amqp_url())

    {:ok, channel} = AMQP.Channel.open(connection)

    {:ok, %{queue: queue_name}} =
      AMQP.Queue.declare(
        channel,
        "",
        exclusive: true
      )

    AMQP.Basic.consume(channel, queue_name, nil, no_ack: false)

    correlation_id =
      :erlang.unique_integer()
      |> :erlang.integer_to_binary()
      |> Base.encode64()

    request = Poison.encode!(data)

    AMQP.Basic.publish(
      channel,
      "",
      queue,
      request,
      reply_to: queue_name,
      correlation_id: correlation_id
    )

    wait_for_messages(channel, correlation_id)
  end

  def publish(data, exchange_name) do
    {:ok, connection} = AMQP.Connection.open(amqp_url())

    {:ok, channel} = AMQP.Channel.open(connection)
    AMQP.Exchange.declare(channel, exchange_name, :fanout)

    AMQP.Basic.publish(channel, exchange_name, "", Poison.encode!(data),
      content_type: "application/json"
    )

    AMQP.Connection.close(connection)
    data
  end

  def publish(data, exchange_name, routing_key) do
    {:ok, connection} = AMQP.Connection.open(amqp_url())

    {:ok, channel} = AMQP.Channel.open(connection)

    AMQP.Exchange.declare(channel, exchange_name, :topic)

    AMQP.Basic.publish(channel, exchange_name, routing_key, Poison.encode!(data),
      content_type: "application/json"
    )

    AMQP.Connection.close(connection)

    data
  end

  def declare_queue(queue) do
    {:ok, connection} = AMQP.Connection.open(amqp_url())

    {:ok, channel} = AMQP.Channel.open(connection)
    AMQP.Queue.declare(channel, queue, durable: false)
  end

  defp open_channel() do
    {:ok, connection} = AMQP.Connection.open(amqp_url())
    {:ok, channel} = AMQP.Channel.open(connection)
    channel
  end

  defp create_outgoing_exchanges() do
    channel = open_channel()
    AMQP.Exchange.declare(channel, @outgoing_vehicle_exchange, :topic, durable: false)
    AMQP.Exchange.declare(channel, @outgoing_booking_exchange, :topic, durable: false)
  end

  def create_match_producer_resources do
    channel = open_channel()

    # Ensure that exchanges are created
    AMQP.Exchange.declare(channel, @outgoing_plan_exchange, :fanout, durable: false)
    AMQP.Exchange.declare(channel, @incoming_booking_exchange, :topic, durable: false)
    AMQP.Exchange.declare(channel, @incoming_vehicle_exchange, :topic, durable: false)

    # Create queues
    register_new_booking_queue = "register_new_booking"
    register_new_vehicle_queue = "register_new_vehicle"
    AMQP.Queue.declare(channel, register_new_vehicle_queue, durable: false)
    AMQP.Queue.declare(channel, register_new_booking_queue, durable: false)

    # Bind queues to exchange
    AMQP.Queue.bind(channel, register_new_vehicle_queue, @incoming_vehicle_exchange(),
      routing_key: "registered"
    )

    AMQP.Queue.bind(channel, register_new_booking_queue, @incoming_booking_exchange,
      routing_key: "registered"
    )

    AMQP.Basic.consume(channel, register_new_vehicle_queue, nil, no_ack: true)
    AMQP.Basic.consume(channel, register_new_booking_queue, nil, no_ack: true)
  end
end
