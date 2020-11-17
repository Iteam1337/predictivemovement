defmodule MessageGenerator do
  alias MessageGenerator.Adapters.RMQ
  alias MessageGenerator.Generator

  @transports_exchange "incoming_vehicle_updates"
  @bookings_exchange "incoming_booking_updates"

  def add_random_transport(properties \\ %{})

  def add_random_transport(properties) when is_map(properties) do
    generate_transport(properties)
    |> RMQ.publish(@transports_exchange, "registered")
  end

  def add_random_transport(city) when city in [:stockholm, :gothenburg] do
    %{}
    |> Generator.put_new_transport_addresses_from_city(city)
    |> generate_transport()
    |> RMQ.publish(@transports_exchange, "registered")
  end

  def generate_transport(properties \\ %{}) do
    properties
    |> Generator.put_new_transport_addresses_from_city(:ljusdal)
  end

  def generate_booking(properties \\ %{}) do
    properties
    |> Map.put_new(:externalId, Enum.random(0..100_000))
    |> Generator.add_booking_addresses()
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
    |> Generator.add_booking_addresses(city)
    |> generate_booking()
    |> RMQ.publish(@bookings_exchange, "registered")
  end
end
