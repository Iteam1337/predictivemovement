defmodule Osrm do
  @osrmBase "https://osrm.iteamdev.io/"

  def nearest(%{lon: lon, lat: lat}) do
    Fetch.json("#{@osrmBase}nearest/v1/driving/#{lon},#{lat}")
  end

  def route(from, to), do: route([from, to])

  def route(positions) do
    coordinates =
      positions
      |> Enum.map(fn %{lat: lat, lon: lon} -> Enum.join([lon, lat], ",") end)
      |> Enum.join(";")

    url =
      "#{@osrmBase}route/v1/driving/#{coordinates}?steps=true&alternatives=false&overview=full&annotations=true"

    Fetch.json(url)
    |> Map.get(:routes)
    |> Enum.sort(fn a, b -> a.duration < b.duration end)
    |> List.first()
    |> Map.update!(:geometry, &decode_polyline/1)
  end

  defp decode_polyline(geometry) do
    %{
      coordinates:
        Polyline.decode(geometry) |> Enum.map(fn {lon, lat} -> %{lon: lon, lat: lat} end)
    }
  end
end
