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

    AMQP.Exchange.declare(channel, @bookings_exchange, :topic, durable: true)
    AMQP.Exchange.declare(channel, @cars_exchange, :topic, durable: true)

    {:ok, channel}
  end

  def random_car(), do: random_car(@ljusdal)

  def random_car(properties) when is_map(properties) do
    properties
    |> Map.put(:id, Enum.random(0..100_000))
    |> Map.put_new(:start_address, Address.random(@ljusdal))
  end

  def random_car(location) do
    %{}
    |> Map.put(:start_address, Address.random(location))
    |> Map.put(:end_address, Address.random(location))
    |> Map.put(:id, Enum.random(0..100_000))
  end

  def random_booking(), do: random_booking(@ljusdal)

  def random_booking(properties) when is_map(properties) do
    properties
    |> add_random_id_and_time()
    |> add_booking_addresses()
    |> Map.put_new(:size, %{measurements: [105, 55, 26], weight: Enum.random(1..200)})
    |> Map.put_new(:metadata, %{
      sender: %{contact: "0701234567"},
      recipient: %{contact: "0701234567"}
    })
  end

  def random_booking(location) do
    %{}
    |> add_booking_addresses(location)
    |> add_random_id_and_time()
    |> Map.put(:size, %{measurements: [105, 55, 26], weight: Enum.random(1..200)})
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
      |> Jason.encode!()

    AMQP.Basic.publish(channel, @bookings_exchange, "registered", payload)

    {:reply, :ok, state}
  end

  def handle_call({:add_random_booking, properties}, _, %{channel: channel} = state)
      when is_map(properties) do
    payload =
      random_booking(properties)
      |> Jason.encode!()

    AMQP.Basic.publish(channel, @bookings_exchange, "registered", payload)

    {:reply, :ok, state}
  end

  def handle_call({:add_random_booking, city}, _, %{channel: channel} = state) do
    payload =
      %{}
      |> add_booking_addresses(city)
      |> random_booking()
      |> Jason.encode!()

    AMQP.Basic.publish(channel, @bookings_exchange, "registered", payload)

    {:reply, :ok, state}
  end

  def handle_call(:add_random_car, _, %{channel: channel} = state) do
    payload =
      random_car()
      |> Jason.encode!()

    AMQP.Basic.publish(channel, @cars_exchange, "registered", payload)

    {:reply, :ok, state}
  end

  def handle_call({:add_random_car, properties}, _, %{channel: channel} = state)
      when is_map(properties) do
    payload =
      random_car(properties)
      |> Jason.encode!()

    AMQP.Basic.publish(channel, @cars_exchange, "registered", payload)

    {:reply, :ok, state}
  end

  def handle_call({:add_random_car, city}, _, %{channel: channel} = state) do
    payload =
      %{}
      |> add_vehicle_addresses(city)
      |> random_car()
      |> Jason.encode!()

    AMQP.Basic.publish(channel, @cars_exchange, "registered", payload)

    {:reply, :ok, state}
  end

  def add_vehicle_addresses(map), do: do_add_vehicle_addresses(map, @ljusdal)
  def add_vehicle_addresses(map, :stockholm), do: do_add_vehicle_addresses(map, @stockholm)
  def add_vehicle_addresses(map, :gothenburg), do: do_add_vehicle_addresses(map, @gothenburg)

  defp do_add_vehicle_addresses(map, location) do
    map
    |> Map.put(:start_address, Address.random(location))
    |> Map.put(:end_address, Address.random(location))
  end

  def add_booking_addresses(map), do: do_add_booking_addresses(map, @ljusdal)
  def add_booking_addresses(map, :stockholm), do: do_add_booking_addresses(map, @stockholm)
  def add_booking_addresses(map, :gothenburg), do: do_add_booking_addresses(map, @gothenburg)

  defp do_add_booking_addresses(map, location) do
    map
    |> Map.put(:pickup, Address.random(location))
    |> Map.put(:delivery, Address.random(location))
  end

  def add_random_id_and_time(map) do
    map
    |> Map.put_new(:id, Enum.random(0..100_000))
    |> Map.put(:bookingDate, DateTime.utc_now())
  end
end
