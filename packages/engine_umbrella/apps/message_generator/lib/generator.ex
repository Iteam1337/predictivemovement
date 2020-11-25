defmodule Generator do
  alias MessageGenerator.Adapters.RMQ
  alias MessageGenerator.TransportGenerator
  alias MessageGenerator.BookingGenerator

  @transports_exchange "incoming_vehicle_updates"
  @bookings_exchange "incoming_booking_updates"

  def add_transport(properties \\ %{})

  def add_transport(properties) when is_map(properties) do
    TransportGenerator.generate_transport_props(properties)
    |> RMQ.publish(@transports_exchange, "registered")
  end

  def add_transport(city) when city in [:stockholm, :gothenburg] do
    %{}
    |> TransportGenerator.put_new_transport_addresses_from_city(city)
    |> TransportGenerator.generate_transport_props()
    |> RMQ.publish(@transports_exchange, "registered")
  end

  def add_transport(phone: phone) when is_binary(phone) do
    formatted_phone =
      phone
      |> String.replace_leading("+", "")
      |> String.replace_leading("0", "46")

    %{metadata: %{driver: %{contact: formatted_phone}}}
    |> TransportGenerator.generate_transport_props()
    |> RMQ.publish(@transports_exchange, "registered")
  end

  def add_booking(properties \\ %{})

  def add_booking(properties) when is_map(properties) do
    BookingGenerator.generate_booking_props(properties)
    |> RMQ.publish(@bookings_exchange, "registered")
  end

  def add_booking(city) when city in [:stockholm, :gothenburg] do
    %{}
    |> BookingGenerator.put_new_booking_addresses_from_city(city)
    |> BookingGenerator.generate_booking_props()
    |> RMQ.publish(@bookings_exchange, "registered")
  end
end
