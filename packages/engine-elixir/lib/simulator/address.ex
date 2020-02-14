defmodule Address do
  def random(%{lng: lng, lat: lat}) do
    lng = lng + (Enum.random(0..100) - 50) / 200
    lat = lat + (Enum.random(0..100) - 50) / 500

    Osrm.nearest(lng, lat)
    |> Map.get("waypoints")
    |> List.first()
    |> Map.get("location")
    |> (fn [lng, lat] -> %{lng: lng, lat: lat} end).()
  end
end
