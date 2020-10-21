defmodule Engine.MatchProducer do
  use GenStage
  alias Broadway.Message
  require Logger

  defp amqp_url, do: "amqp://" <> Application.fetch_env!(:engine, :amqp_host)

  @incoming_vehicle_exchange Application.compile_env!(:engine, :incoming_vehicle_exchange)
  @incoming_booking_exchange Application.compile_env!(:engine, :incoming_booking_exchange)
  @reconnect_interval 5_000

  def start_link(_) do
    GenStage.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init(_) do
    {:producer, %{}}
  end

  defp handle_new_booking(booking_msg, _) do
    IO.puts("new booking!")
    new_booking = string_to_booking_transform(booking_msg)

    message = %Message{
      data: %{booking: new_booking},
      acknowledger: {__MODULE__, :ack_id, :ack_data}
    }

    {:noreply, [message], %{}}
  end

  defp handle_new_vehicle(vehicle_msg, _) do
    IO.puts("new vehicle!")
    new_vehicle = string_to_vehicle_transform(vehicle_msg)

    message = %Message{
      data: %{vehicle: new_vehicle},
      acknowledger: {__MODULE__, :ack_id, :ack_data}
    }

    {:noreply, [message], %{}}
  end

  ## helpers

  defp string_to_vehicle_transform(vehicle_string) do
    vehicle_string
    |> Jason.decode!(keys: :atoms)
    |> Map.delete(:id)
  end

  defp string_to_booking_transform(booking_string) do
    Jason.decode!(booking_string, keys: :atoms)
    |> Map.put_new(:metadata, %{})
    |> Map.put_new(:size, nil)
  end

  def setup_resources(channel) do
    AMQP.Exchange.declare(channel, @incoming_booking_exchange, :topic, durable: false)
    AMQP.Exchange.declare(channel, @incoming_vehicle_exchange, :topic, durable: false)

    register_new_booking_queue = "register_new_booking"
    register_new_vehicle_queue = "register_new_vehicle"
    AMQP.Queue.declare(channel, register_new_vehicle_queue, durable: false)
    AMQP.Queue.declare(channel, register_new_booking_queue, durable: false)

    AMQP.Queue.bind(channel, register_new_vehicle_queue, @incoming_vehicle_exchange,
      routing_key: "registered"
    )

    AMQP.Queue.bind(channel, register_new_booking_queue, @incoming_booking_exchange,
      routing_key: "registered"
    )

    AMQP.Basic.consume(channel, register_new_vehicle_queue, nil, no_ack: true)
    AMQP.Basic.consume(channel, register_new_booking_queue, nil, no_ack: true)

    :ok
  end

  def handle_info(:connect, _) do
    with {:ok, conn} <- AMQP.Connection.open(amqp_url()),
         {:ok, channel} <- AMQP.Channel.open(conn),
         :ok <- setup_resources(channel) do
      Process.monitor(conn.pid)
      {:noreply, channel}
    else
      _ ->
        Logger.error("Failed to connect #{amqp_url()}. Reconnecting later...")
        Process.send_after(self(), :connect, @reconnect_interval)
        {:noreply, nil}
    end
  end

  def handle_info({:DOWN, _, :process, _pid, reason}, _) do
    {:stop, {:connection_lost, reason}, nil}
  end

  # Rabbitmq callbacks
  def handle_info({:basic_consume_ok, _}, state), do: {:noreply, [], state}

  def handle_info({:basic_deliver, vehicle, %{exchange: @incoming_vehicle_exchange}}, state),
    do: handle_new_vehicle(vehicle, state)

  def handle_info({:basic_deliver, booking, %{exchange: @incoming_booking_exchange}}, state),
    do: handle_new_booking(booking, state)

  ## handle backpressure

  def handle_demand(_demand, state) do
    {:noreply, [], state}
  end

  def ack(_ack_ref, _successful, _failed) do
    :ok
  end
end
