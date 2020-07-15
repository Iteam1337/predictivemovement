defmodule MQ do
  def amqp_url, do: "amqp://" <> Application.fetch_env!(:engine, :amqp_host)

  def available_bookings_queue_name,
    do: Application.fetch_env!(:engine, :available_bookings_queue_name)

  def vehicles_exchange, do: Application.fetch_env!(:engine, :vehicles_exchange)
  def bookings_exchange, do: Application.fetch_env!(:engine, :bookings_exchange)

  def available_vehicles_queue_name,
    do: Application.fetch_env!(:engine, :available_vehicles_queue_name)

  def clear_queue, do: Application.fetch_env!(:engine, :clear_queue)

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

  ## set up queues

  def create_rmq_resources do
    # Setup RabbitMQ connection
    {:ok, connection} = AMQP.Connection.open(amqp_url())

    {:ok, channel} = AMQP.Channel.open(connection)

    # Create exchange
    AMQP.Exchange.fanout(channel, vehicles_exchange(), durable: false)
    AMQP.Exchange.declare(channel, bookings_exchange(), :topic, durable: false)

    # Create queues
    AMQP.Queue.declare(channel, available_vehicles_queue_name(), durable: false)
    AMQP.Queue.declare(channel, available_bookings_queue_name(), durable: false)
    AMQP.Queue.declare(channel, clear_queue(), durable: false)

    # Bind queues to exchange
    AMQP.Queue.bind(channel, available_vehicles_queue_name(), vehicles_exchange(),
      routing_key: available_vehicles_queue_name()
    )

    AMQP.Queue.bind(channel, available_bookings_queue_name(), bookings_exchange(),
      routing_key: "new"
    )

    AMQP.Basic.consume(channel, available_vehicles_queue_name(), nil, no_ack: true)
    AMQP.Basic.consume(channel, available_bookings_queue_name(), nil, no_ack: true)
    AMQP.Basic.consume(channel, clear_queue(), nil, no_ack: true)
  end
end
