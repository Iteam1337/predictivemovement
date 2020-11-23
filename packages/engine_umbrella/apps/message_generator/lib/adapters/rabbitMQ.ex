defmodule MessageGenerator.Adapters.RMQ do
  use GenServer
  require Logger
  alias AMQP.{Exchange, Queue, Channel, Basic, Connection}

  defp amqp_url, do: "amqp://" <> Application.fetch_env!(:engine, :amqp_host)

  @outgoing_vehicle_exchange Application.compile_env!(:engine, :outgoing_vehicle_exchange)
  @outgoing_booking_exchange Application.compile_env!(:engine, :outgoing_booking_exchange)
  @outgoing_plan_exchange Application.compile_env!(:engine, :outgoing_plan_exchange)
  @reconnect_interval 5_000

  def start_link(_) do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  @impl true
  def init(_) do
    send(self(), :connect)

    {:ok, %{conn: nil, channel: nil}}
  end

  def publish(data, exchange_name) do
    GenServer.call(__MODULE__, {:publish, data, exchange_name, ""})
  end

  def publish(data, exchange_name, routing_key) do
    GenServer.call(__MODULE__, {:publish, data, exchange_name, routing_key})
  end

  def get_connection do
    case GenServer.call(__MODULE__, :get_connection) do
      nil -> {:error, :not_connected}
      conn -> {:ok, conn}
    end
  end

  @impl true
  def handle_call(:get_connection, _, %{conn: conn} = state), do: {:reply, conn, state}

  @impl true
  def handle_call({:publish, data, exchange_name, routing_key}, _, %{channel: channel} = state) do
    Basic.publish(channel, exchange_name, routing_key, Jason.encode!(data),
      content_type: "application/json",
      persistent: true
    )

    {:reply, data, state}
  end

  @impl true
  def handle_info(:connect, current_state) do
    with {:ok, conn} <- Connection.open(amqp_url()),
         {:ok, channel} <- Channel.open(conn),
         :ok <- setup_resources(channel) do
      Process.monitor(conn.pid)
      Logger.info("#{__MODULE__} connected to rabbitmq")
      {:noreply, %{conn: conn, channel: channel}}
    else
      _ ->
        Logger.error("Failed to connect #{amqp_url()}. Reconnecting later...")
        Process.send_after(self(), :connect, @reconnect_interval)
        {:noreply, current_state}
    end
  end

  @impl true
  def handle_info({:DOWN, _, :process, _pid, reason}, _) do
    {:stop, {:connection_lost, reason}, nil}
  end

  def setup_resources(channel) do
    Exchange.declare(channel, @outgoing_plan_exchange, :fanout, durable: true)
    Exchange.declare(channel, @outgoing_vehicle_exchange, :topic, durable: true)
    Exchange.declare(channel, @outgoing_booking_exchange, :topic, durable: true)
    Exchange.declare(channel, "engine_DLX", :fanout, durable: true)

    Queue.declare(channel, "store_dead_letters.engine", durable: true)
    Queue.bind(channel, "store_dead_letters.engine", "engine_DLX")

    :ok
  end
end
