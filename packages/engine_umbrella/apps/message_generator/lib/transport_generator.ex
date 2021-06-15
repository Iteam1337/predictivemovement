defmodule MessageGenerator.TransportGenerator do
  alias MessageGenerator.Address
  alias MessageGenerator.Id

  @stockholm %{lat: 59.3414072, lon: 18.0470482}
  @gothenburg %{lat: 57.7009147, lon: 11.7537571}
  @ljusdal %{lat: 61.829182, lon: 16.0896213}

  defp default_metadata() do
    %{
      profile: "Generated transport #{Enum.random(1..100)}",
      driver: %{contact: "4676000#{Enum.random(1000..9999)}"}
    }
  end

  def generate_transport_props(properties \\ %{}) do
    default_meta = default_metadata()

    properties
    |> Map.put_new(:id, Id.generate_transport_id())
    |> put_new_transport_addresses_from_city(:ljusdal)
    |> Map.update(:metadata, default_meta, &Map.merge(default_meta, &1))
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
