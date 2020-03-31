defmodule Address do
  def random(%{lon: lon, lat: lat}) do
    lon = lon + (Enum.random(0..100) - 50) / 200
    lat = lat + (Enum.random(0..100) - 50) / 500

    IO.puts("Finding address for #{lon} #{lat}")

    position = %{lon: lon, lat: lat}
    parse(Osrm.nearest(position), position)
  end

  def parse(%{waypoints: [first | _tail]}, _position) do
    first.location |> (fn [lon, lat] -> %{lon: lon, lat: lat} end).()
  end

  def parse(%{waypoints: []}, position) do
    parse(nil, position)
  end

  @doc """
  If no valid address was found, try again
  """
  def parse(nil, position) do
    random(position)
  end
end
