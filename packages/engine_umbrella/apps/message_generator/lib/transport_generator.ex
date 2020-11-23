defmodule MessageGenerator.TransportGenerator do
  alias MessageGenerator.Address

  @stockholm %{lat: 59.3414072, lon: 18.0470482}
  @gothenburg %{lat: 57.7009147, lon: 11.7537571}
  @ljusdal %{lat: 61.829182, lon: 16.0896213}

  def generate_transport_props(properties \\ %{}) do
    properties
    |> put_new_transport_addresses_from_city(:ljusdal)
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
  end
end
