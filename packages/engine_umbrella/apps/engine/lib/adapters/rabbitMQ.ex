defmodule Engine.Adapters.RMQ do
  use GenServer
  require Logger
  defp amqp_url, do: "amqp://" <> Application.fetch_env!(:engine, :amqp_host)

  @outgoing_vehicle_exchange Application.compile_env!(:engine, :outgoing_vehicle_exchange)
  @outgoing_booking_exchange Application.compile_env!(:engine, :outgoing_booking_exchange)
  @outgoing_plan_exchange Application.compile_env!(:engine, :outgoing_plan_exchange)
  @reconnect_interval 5_000

  def init(_) do
    send(self(), :connect)

    {:ok, nil}
  end

  def wait_for_messages(channel, correlation_id) do
    receive do
      {:basic_deliver, payload, %{correlation_id: ^correlation_id} = msg} ->
        AMQP.Queue.unsubscribe(channel, Map.get(msg, :consumer_tag))
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
        exclusive: true,
        auto_delete: true
      )

    AMQP.Basic.consume(channel, queue_name, nil, no_ack: false)
    IO.puts("Engine wants response from #{queue} to #{queue_name}")

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
    GenServer.call(__MODULE__, {:publish, data, exchange_name, ""})
  end

  def publish(data, exchange_name, routing_key) do
    GenServer.call(__MODULE__, {:publish, data, exchange_name, routing_key})
  end

  def handle_call({:publish, data, exchange_name, routing_key}, {_conn, channel} = state) do
    AMQP.Basic.publish(channel, exchange_name, routing_key, Poison.encode!(data),
      content_type: "application/json"
    )

    {:reply, data, state}
  end

  def handle_call(:get_conn, {conn, _channel} = state) do
    {:reply, conn, state}
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

  def setup_resources(channel) do
    AMQP.Exchange.declare(channel, @outgoing_plan_exchange, :topic, durable: false)
    AMQP.Exchange.declare(channel, @outgoing_vehicle_exchange, :topic, durable: false)
    AMQP.Exchange.declare(channel, @outgoing_booking_exchange, :topic, durable: false)
    # Setup DLX also
    :ok
  end
end
