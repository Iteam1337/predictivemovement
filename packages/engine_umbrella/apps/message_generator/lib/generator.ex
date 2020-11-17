defmodule MessageGenerator.Generator do
  alias MessageGenerator.Address

  @stockholm %{lat: 59.3414072, lon: 18.0470482}
  @gothenburg %{lat: 57.7009147, lon: 11.7537571}
  @ljusdal %{lat: 61.829182, lon: 16.0896213}

  def put_new_booking_addresses_from_city(map), do: do_add_booking_addresses(map, @ljusdal)

  def put_new_booking_addresses_from_city(map, :stockholm),
    do: do_add_booking_addresses(map, @stockholm)

  def put_new_booking_addresses_from_city(map, :gothenburg),
    do: do_add_booking_addresses(map, @gothenburg)

  defp do_add_booking_addresses(map, location) do
    map
    |> Map.put_new(:pickup, Address.random(location))
    |> Map.put_new(:delivery, Address.random(location))
  end

  def put_new_transport_addresses_from_city(map, :ljusdal),
    do: do_add_transport_addresses(map, @ljusdal)

  def put_new_transport_addresses_from_city(map, :stockholm),
    do: do_add_transport_addresses(map, @stockholm)

  def put_new_transport_addresses_from_city(map, :gothenburg),
    do: do_add_transport_addresses(map, @gothenburg)

  defp do_add_transport_addresses(map, location) do
    map
    |> Map.put_new(:start_address, Address.random(location))
    |> Map.put_new(:end_address, Address.random(location))
  end
end
