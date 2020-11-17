defmodule MessageGenerator do
  alias MessageGenerator.Address
  alias MessageGenerator.Adapters.RMQ

  @transports_exchange "incoming_vehicle_updates"
  @bookings_exchange "incoming_booking_updates"

  @stockholm %{lat: 59.3414072, lon: 18.0470482}
  @gothenburg %{lat: 57.7009147, lon: 11.7537571}
  @ljusdal %{lat: 61.829182, lon: 16.0896213}

  def add_random_transport(properties \\ %{})

  def add_random_transport(properties) when is_map(properties) do
    generate_transport(properties)
    |> RMQ.publish(@transports_exchange, "registered")
  end

  def add_random_transport(city) when city in [:stockholm, :gothenburg] do
    %{}
    |> add_transport_addresses(city)
    |> generate_transport()
    |> RMQ.publish(@transports_exchange, "registered")
  end

  def generate_transport(properties \\ %{}) do
    properties
    |> Map.put_new(:start_address, Address.random(@ljusdal))
  end

  def add_transport_addresses(map), do: do_add_transport_addresses(map, @ljusdal)
  def add_transport_addresses(map, :stockholm), do: do_add_transport_addresses(map, @stockholm)
  def add_transport_addresses(map, :gothenburg), do: do_add_transport_addresses(map, @gothenburg)

  defp do_add_transport_addresses(map, location) do
    map
    |> Map.put(:start_address, Address.random(location))
    |> Map.put(:end_address, Address.random(location))
  end

  def generate_booking(properties \\ %{}) do
    properties
    |> Map.put_new(:externalId, Enum.random(0..100_000))
    |> add_booking_addresses()
    |> Map.put_new(:size, %{measurements: [105, 55, 26], weight: Enum.random(1..200)})
    |> Map.put_new(:metadata, %{
      sender: %{contact: "0701234567"},
      recipient: %{contact: "0701234567"}
    })
  end

  def add_random_booking(properties \\ %{})

  def add_random_booking(properties) when is_map(properties) do
    generate_booking(properties)
    |> RMQ.publish(@bookings_exchange, "registered")
  end

  def add_random_booking(city) when city in [:stockholm, :gothenburg] do
    %{}
    |> add_booking_addresses(city)
    |> generate_booking()
    |> RMQ.publish(@bookings_exchange, "registered")
  end

  def add_booking_addresses(map), do: do_add_booking_addresses(map, @ljusdal)
  def add_booking_addresses(map, :stockholm), do: do_add_booking_addresses(map, @stockholm)
  def add_booking_addresses(map, :gothenburg), do: do_add_booking_addresses(map, @gothenburg)

  defp do_add_booking_addresses(map, location) do
    map
    |> Map.put(:pickup, Address.random(location))
    |> Map.put(:delivery, Address.random(location))
  end
end
