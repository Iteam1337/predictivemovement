defmodule MessageGenerator do
  use GenServer
  @rmq_uri "amqp://localhost"
  @cars_exchange "cars"
  @bookings_exchange "bookings"

  @center %{lat: 61.829182, lon: 16.0896213}

  def start_link(_opts) do
    GenServer.start_link(__MODULE__, nil, name: __MODULE__)
  end

  def init(_) do
    {:ok, channel} = start_amqp_resources()
    {:ok, %{channel: channel}}
  end

  def start_amqp_resources() do
    {:ok, connection} = AMQP.Connection.open(@rmq_uri)
    {:ok, channel} = AMQP.Channel.open(connection)

    AMQP.Exchange.declare(channel, @bookings_exchange, :topic, durable: false)
    AMQP.Exchange.fanout(channel, @cars_exchange, durable: false)

    {:ok, channel}
  end

  def add_random_car(), do: GenServer.call(__MODULE__, :add_random_car)
  def add_random_booking(), do: GenServer.call(__MODULE__, :add_random_booking)

  def handle_call(:add_random_booking, _, %{channel: channel} = state) do
    payload =
      %{}
      |> add_addresses()
      |> add_random_id_and_time()
      |> Poison.encode!()

    AMQP.Basic.publish(channel, @bookings_exchange, "new", payload)

    {:reply, :ok, state}
  end

  def handle_call(:add_random_car, _, %{channel: channel} = state) do
    payload =
      %{}
      |> Map.put(:position, Address.random(@center))
      |> Poison.encode!()

    AMQP.Basic.publish(channel, @cars_exchange, "", payload)

    {:reply, :ok, state}
  end

  def add_addresses(map) do
    map
    |> Map.put(:departure, Address.random(@center))
    |> Map.put(:destination, Address.random(@center))
  end

  def add_random_id_and_time(map) do
    map
    |> Map.put(:id, Enum.random(0..100_000))
    |> Map.put(:bookingDate, DateTime.utc_now())
  end
end
