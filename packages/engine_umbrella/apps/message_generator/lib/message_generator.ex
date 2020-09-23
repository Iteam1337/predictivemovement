defmodule MessageGenerator do
  use GenServer
  alias MessageGenerator.Address
  def amqp_url, do: "amqp://" <> Application.fetch_env!(:message_generator, :amqp_host)

  @cars_exchange "incoming_vehicle_updates"
  @bookings_exchange "incoming_booking_updates"
  @stockholm %{lat: 59.3414072, lon: 18.0470482}

  @gothenburg %{lat: 57.7009147, lon: 11.7537571}

  @ljusdal %{lat: 61.829182, lon: 16.0896213}

  def start_link(_opts) do
    GenServer.start_link(__MODULE__, nil, name: __MODULE__)
  end

  def init(_) do
    {:ok, channel} = start_amqp_resources()
    {:ok, %{channel: channel}}
  end

  def start_amqp_resources() do
    {:ok, connection} = AMQP.Connection.open(amqp_url())
    {:ok, channel} = AMQP.Channel.open(connection)

    AMQP.Exchange.declare(channel, @bookings_exchange, :topic, durable: false)
    AMQP.Exchange.declare(channel, @cars_exchange, :topic, durable: false)

    {:ok, channel}
  end

  def random_car(), do: random_car(@ljusdal)

  def random_car(properties) when is_map(properties) do
    properties
    |> Map.put(:id, Enum.random(0..100_000))
    |> Map.put_new(:capacity, %{volume: 15, weight: 700})
    |> Map.put_new(:start_address, Address.random(@ljusdal))
  end

  def random_car(location) do
    %{}
    |> Map.put(:start_address, Address.random(location))
    |> Map.put(:end_address, Address.random(location))
    |> Map.put(:capacity, %{volume: 15, weight: 700})
    |> Map.put(:id, Enum.random(0..100_000))
  end

  def random_booking(), do: random_booking(@ljusdal)

  def random_booking(properties) when is_map(properties) do
    properties
    |> add_random_id_and_time()
    |> add_addresses()
    |> Map.put_new(:size, %{measurements: [105, 55, 26], weight: 13.7})
    |> Map.put(:metadata, %{sender: %{contact: "0701234567"}, recipient: %{contact: "0701234567"}})
  end

  def random_booking(location) do
    %{}
    |> add_addresses(location)
    |> add_random_id_and_time()
    |> Map.put(:size, %{measurements: [105, 55, 26], weight: 13.7})
  end

  def add_random_car(), do: GenServer.call(__MODULE__, :add_random_car)
  def add_random_booking(), do: GenServer.call(__MODULE__, :add_random_booking)

  def add_random_car(properties) when is_map(properties),
    do: GenServer.call(__MODULE__, {:add_random_car, properties})

  def add_random_car(:stockholm), do: GenServer.call(__MODULE__, {:add_random_car, :stockholm})
  def add_random_car(:gothenburg), do: GenServer.call(__MODULE__, {:add_random_car, :gothenburg})

  def add_random_booking(properties) when is_map(properties),
    do: GenServer.call(__MODULE__, {:add_random_booking, properties})

  def add_random_booking(:stockholm),
    do: GenServer.call(__MODULE__, {:add_random_booking, :stockholm})

  def add_random_booking(:gothenburg),
    do: GenServer.call(__MODULE__, {:add_random_booking, :gothenburg})

  def handle_call(:add_random_booking, _, %{channel: channel} = state) do
    payload =
      random_booking()
      |> Poison.encode!()

    AMQP.Basic.publish(channel, @bookings_exchange, "registered", payload)

    {:reply, :ok, state}
  end

  def handle_call({:add_random_booking, properties}, _, %{channel: channel} = state)
      when is_map(properties) do
    payload =
      random_booking(properties)
      |> Poison.encode!()

    AMQP.Basic.publish(channel, @bookings_exchange, "registered", payload)

    {:reply, :ok, state}
  end

  def handle_call({:add_random_booking, :stockholm}, _, %{channel: channel} = state) do
    payload =
      %{}
      |> add_addresses(@stockholm)
      |> random_booking()
      |> Poison.encode!()

    AMQP.Basic.publish(channel, @bookings_exchange, "registered", payload)

    {:reply, :ok, state}
  end

  def handle_call({:add_random_booking, :gothenburg}, _, %{channel: channel} = state) do
    payload =
      %{}
      |> add_addresses(@gothenburg)
      |> random_booking()
      |> Poison.encode!()

    AMQP.Basic.publish(channel, @bookings_exchange, "registered", payload)

    {:reply, :ok, state}
  end

  def handle_call(:add_random_car, _, %{channel: channel} = state) do
    payload =
      random_car()
      |> Poison.encode!()

    AMQP.Basic.publish(channel, @cars_exchange, "registered", payload)

    {:reply, :ok, state}
  end

  def handle_call({:add_random_car, properties}, _, %{channel: channel} = state)
      when is_map(properties) do
    payload =
      random_car(properties)
      |> Poison.encode!()

    AMQP.Basic.publish(channel, @cars_exchange, "registered", payload)

    {:reply, :ok, state}
  end

  def handle_call({:add_random_car, :stockholm}, _, %{channel: channel} = state) do
    payload =
      %{}
      |> Map.put(:start_address, Address.random(@stockholm))
      |> Map.put(:end_address, Address.random(@stockholm))
      |> random_car()
      |> Poison.encode!()

    AMQP.Basic.publish(channel, @cars_exchange, "registered", payload)

    {:reply, :ok, state}
  end

  def handle_call({:add_random_car, :gothenburg}, _, %{channel: channel} = state) do
    payload =
      %{}
      |> Map.put(:start_address, Address.random(@gothenburg))
      |> Map.put(:end_address, Address.random(@gothenburg))
      |> random_car()
      |> Poison.encode!()

    AMQP.Basic.publish(channel, @cars_exchange, "registered", payload)

    {:reply, :ok, state}
  end

  def add_addresses(map, center \\ @ljusdal) do
    map
    |> Map.put_new(:pickup, Address.random(center))
    |> Map.put_new(:delivery, Address.random(center))
  end

  def add_random_id_and_time(map) do
    map
    |> Map.put(:id, Enum.random(0..100_000))
    |> Map.put(:bookingDate, DateTime.utc_now())
  end
end
