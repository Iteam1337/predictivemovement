defmodule Osrm do
  @osrmBase "http://osrm.pm.iteamdev.se/"

  def nearest(%{lon: lon, lat: lat}) do
    Fetch.json("#{@osrmBase}nearest/v1/driving/#{lon},#{lat}")
  end

  # route (from, to) {

  #   // http://{server}/route/v1/{profile}/{coordinates}?alternatives={true|false}&steps={true|false}&geometries={polyline|geojson}&overview={full|simplified|false}&annotations={true|false}
  #   const coordinates = [[from.lon, from.lat], [to.lon, to.lat]].join(';')
  #   return fetch(`${osrmUrl}/route/v1/driving/${coordinates}?steps=true&alternatives=false&overview=full&annotations=true`)
  #     .then(response => response.json())

  #     // fastest route
  #     .then(result => result.routes && result.routes.sort((a, b) => a.duration < b.duration)[0])
  #     .then(route => {
  #       if (!route) return {}

  #       route.geometry = { coordinates: decodePolyline(route.geometry) }
  #       return route
  #     })
  # },
  def route(from, to) do
    url =
      "#{@osrmBase}route/v1/driving/#{from.lon},#{from.lat};#{to.lon},#{to.lat}?steps=true&alternatives=false&overview=full&annotations=true"

    Fetch.json(url)
    |> Map.get(:routes)
    |> Enum.sort(fn a, b -> a.duration < b.duration end)
    |> List.first()
    |> Map.update!(:geometry, &decode_polyline/1)
  end

  def decode_polyline(geometry) do
    %{
      coordinates:
        Polyline.decode(geometry) |> Enum.map(fn {lon, lat} -> %{lon: lon, lat: lat} end)
    }
  end

  def trip(positions) do
    coordinates =
      positions
      |> Enum.map(fn %{lat: lat, lon: lon} -> Enum.join([lon, lat], ",") end)
      |> Enum.join(";")

    url =
      "#{@osrmBase}trip/v1/driving/#{coordinates}?geometries=geojson&annotations=true&source=first&destination=last&overview=full&steps=true"

    Fetch.json(url)
  end
end
