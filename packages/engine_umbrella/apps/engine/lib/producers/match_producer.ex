defmodule Engine.MatchProducer do
  use GenStage
  alias Broadway.Message
  require Logger
  alias AMQP.{Exchange, Queue, Channel, Basic, Connection}

  defp amqp_url, do: "amqp://" <> Application.fetch_env!(:engine, :amqp_host)

  @incoming_vehicle_exchange Application.compile_env!(:engine, :incoming_vehicle_exchange)
  @incoming_booking_exchange Application.compile_env!(:engine, :incoming_booking_exchange)
  @reconnect_interval 5_000

  def start_link(_) do
    GenStage.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init(_) do
    send(self(), :connect)

    {:producer, nil}
  end

  defp handle_new_booking(delivery_tag, booking_msg, channel) do
    IO.puts("new booking!")

    message = %Message{
      data: %{booking: booking_msg},
      acknowledger: {__MODULE__, _ack_ref = channel, delivery_tag}
    }

    {:noreply, [message], channel}
  end

  defp handle_new_vehicle(delivery_tag, vehicle_msg, channel) do
    IO.puts("new vehicle!")

    message = %Message{
      data: %{vehicle: vehicle_msg},
      acknowledger: {__MODULE__, _ack_ref = channel, delivery_tag}
    }

    {:noreply, [message], channel}
  end

  def setup_resources(channel) do
    Exchange.declare(channel, @incoming_booking_exchange, :topic, durable: true)
    Exchange.declare(channel, @incoming_vehicle_exchange, :topic, durable: true)

    register_new_booking_queue = "register_new_booking"
    register_new_vehicle_queue = "register_new_vehicle"

    Queue.declare(channel, register_new_vehicle_queue,
      durable: true,
      arguments: [{"x-dead-letter-exchange", "engine_DLX"}]
    )

    Queue.declare(channel, register_new_booking_queue,
      durable: true,
      arguments: [{"x-dead-letter-exchange", "engine_DLX"}]
    )

    Queue.bind(channel, register_new_vehicle_queue, @incoming_vehicle_exchange,
      routing_key: "registered"
    )

    Queue.bind(channel, register_new_booking_queue, @incoming_booking_exchange,
      routing_key: "registered"
    )

    Basic.consume(channel, register_new_vehicle_queue, nil)

    Basic.consume(channel, register_new_booking_queue, nil)

    :ok
  end

  def handle_info(:connect, _) do
    with {:ok, conn} <- Connection.open(amqp_url()),
         {:ok, channel} <- Channel.open(conn),
         :ok <- setup_resources(channel) do
      Logger.info("#{__MODULE__} connected to rabbitmq")
      Process.monitor(conn.pid)
      {:noreply, [], channel}
    else
      _ ->
        Logger.error("Failed to connect #{amqp_url()}. Reconnecting later...")
        Process.send_after(self(), :connect, @reconnect_interval)
        {:noreply, [], nil}
    end
  end

  def handle_info({:DOWN, _, :process, _pid, reason}, _) do
    {:stop, {:connection_lost, reason}, nil}
  end

  # Rabbitmq callbacks
  def handle_info({:basic_consume_ok, _}, state), do: {:noreply, [], state}

  def handle_info(
        {:basic_deliver, vehicle, %{exchange: @incoming_vehicle_exchange, delivery_tag: tag}},
        channel
      ),
      do: handle_new_vehicle(tag, vehicle, channel)

  def handle_info(
        {:basic_deliver, booking, %{exchange: @incoming_booking_exchange, delivery_tag: tag}},
        channel
      ),
      do: handle_new_booking(tag, booking, channel)

  ## handle backpressure
  def handle_demand(_demand, channel) do
    {:noreply, [], channel}
  end

  def ack(channel, successful, failed) do
    do_acks(channel, successful)
    do_nacks(channel, failed)

    :ok
  end

  defp do_acks(channel, messages) do
    Enum.each(messages, fn msg ->
      {_module, _channel, delivery_tag} = msg.acknowledger
      AMQP.Basic.ack(channel, delivery_tag)
    end)
  end

  defp do_nacks(channel, messages) do
    Enum.each(messages, fn msg ->
      {_module, _channel, delivery_tag} = msg.acknowledger
      AMQP.Basic.nack(channel, delivery_tag, requeue: false)
    end)
  end
end
