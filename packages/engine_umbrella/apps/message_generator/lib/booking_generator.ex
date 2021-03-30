defmodule MessageGenerator.BookingGenerator do
  alias MessageGenerator.Address

  @stockholm %{lat: 59.3414072, lon: 18.0470482}
  @gothenburg %{lat: 57.7009147, lon: 11.7537571}
  @ljusdal %{lat: 61.829182, lon: 16.0896213}


  @default_metadata %{
    fragile: false,
    customer: "",
    cargo: "",
    sender: %{contact: "0701234567", name: "Anna Mottagaresson"},
    recipient: %{contact: "0707654321", name: "Mats Avsändaresson"}
  }

  def generate_booking_props(properties \\ %{}) do
    properties
    |> Map.put_new(:external_id, Enum.random(0..100_000))
    |> put_new_booking_addresses_from_city(:ljusdal)
    |> Map.put_new(:size, %{measurements: [105, 55, 26], weight: Enum.random(1..200)})
    |> Map.update(:metadata, @default_metadata, &Map.merge(@default_metadata, &1))
  end

  def put_new_booking_addresses_from_city(map, :ljusdal),
    do: do_add_booking_addresses(map, @ljusdal)

  def put_new_booking_addresses_from_city(map, :stockholm),
    do: do_add_booking_addresses(map, @stockholm)

  def put_new_booking_addresses_from_city(map, :gothenburg),
    do: do_add_booking_addresses(map, @gothenburg)

  defp do_add_booking_addresses(map, location) do
    map
    |> Map.put_new(:pickup, Address.random(location))
    |> Map.put_new(:delivery, Address.random(location))
  end
end
