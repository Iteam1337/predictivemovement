defmodule MessageGenerator do
  use GenServer
  alias MessageGenerator.Address
  alias MessageGenerator.Adapters.RMQ

  @transports_exchange "incoming_vehicle_updates"
  @bookings_exchange "incoming_booking_updates"

  @stockholm %{lat: 59.3414072, lon: 18.0470482}
  @gothenburg %{lat: 57.7009147, lon: 11.7537571}
  @ljusdal %{lat: 61.829182, lon: 16.0896213}

  def start_link(_opts) do
    GenServer.start_link(__MODULE__, nil, name: __MODULE__)
  end

  def init(_) do
    {:ok, %{}}
  end

  def add_random_transport() do
    generate_transport()
    |> RMQ.publish(@transports_exchange, "registered")
  end

  def add_random_transport(properties) when is_map(properties) do
    generate_transport(properties)
    |> RMQ.publish(@transports_exchange, "registered")
  end

  def add_random_transport(city) when city in [:stockholm, :gothenburg] do
    %{}
    |> add_vehicle_addresses(city)
    |> generate_transport()
    |> RMQ.publish(@transports_exchange, "registered")
  end

  def generate_transport() do
    %{}
    |> Map.put(:start_address, Address.random(@ljusdal))
    |> Map.put(:end_address, Address.random(@ljusdal))
    |> Map.put(:id, Enum.random(0..100_000))
  end

  def generate_transport(properties) when is_map(properties) do
    properties
    |> Map.put(:id, Enum.random(0..100_000))
    |> Map.put_new(:start_address, Address.random(@ljusdal))
  end

  def add_vehicle_addresses(map), do: do_add_vehicle_addresses(map, @ljusdal)
  def add_vehicle_addresses(map, :stockholm), do: do_add_vehicle_addresses(map, @stockholm)
  def add_vehicle_addresses(map, :gothenburg), do: do_add_vehicle_addresses(map, @gothenburg)

  defp do_add_vehicle_addresses(map, location) do
    map
    |> Map.put(:start_address, Address.random(location))
    |> Map.put(:end_address, Address.random(location))
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

  def add_random_booking(), do: GenServer.call(__MODULE__, :add_random_booking)

  def add_random_booking(properties) when is_map(properties),
    do: GenServer.call(__MODULE__, {:add_random_booking, properties})

  def add_random_booking(:stockholm),
    do: GenServer.call(__MODULE__, {:add_random_booking, :stockholm})

  def add_random_booking(:gothenburg),
    do: GenServer.call(__MODULE__, {:add_random_booking, :gothenburg})

  def handle_call(:add_random_booking, _, state) do
    payload = random_booking()

    RMQ.publish(payload, @bookings_exchange, "registered")

    {:reply, :ok, state}
  end

  def handle_call({:add_random_booking, properties}, _, state)
      when is_map(properties) do
    payload = random_booking(properties)

    RMQ.publish(payload, @bookings_exchange, "registered")

    {:reply, :ok, state}
  end

  def handle_call({:add_random_booking, city}, _, state) do
    payload =
      %{}
      |> add_booking_addresses(city)
      |> random_booking()

    RMQ.publish(payload, @bookings_exchange, "registered")

    {:reply, :ok, state}
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
    |> Map.put_new(:externalId, Enum.random(0..100_000))
    |> Map.put(:bookingDate, DateTime.utc_now())
  end
end
