defmodule MessageGenerator.Address do
  alias MessageGenerator.Osrm
  alias MessageGenerator.Adapters.Pelias

  def random(%{lon: lon, lat: lat}) do
    lon = lon + (Enum.random(0..100) - 50) / 200
    lat = lat + (Enum.random(0..100) - 50) / 500

    position = %{lon: lon, lat: lat}
    coordinates = parse(Osrm.nearest(position), position)

    Pelias.get_address_info_from_coordinates(coordinates.lat, coordinates.lon)
    |> Map.merge(coordinates)
  end

  # Useful for testing multiple packages at the same location
  def not_random(%{lon: lon, lat: lat}) do
    position = %{lon: lon, lat: lat}
    parse(Osrm.nearest(position), position)
  end

  def parse(%{"waypoints" => [first | _tail]}, _position) do
    first["location"] |> (fn [lon, lat] -> %{lon: lon, lat: lat} end).()
  end

  def parse(%{"waypoints" => []}, position) do
    parse(nil, position)
  end

  # If no valid address was found, try again
  def parse(nil, position) do
    random(position)
  end
end
