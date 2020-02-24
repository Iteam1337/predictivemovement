defmodule Address do
  def random(%{lon: lon, lat: lat}) do
    lon = lon + (Enum.random(0..100) - 50) / 200
    lat = lat + (Enum.random(0..100) - 50) / 500

    Osrm.nearest(%{lon: lon, lat: lat})
    |> Map.get("waypoints")
    |> List.first()
    |> Map.get("location")
    |> (fn [lon, lat] -> %{lon: lon, lat: lat} end).()
  end
end
