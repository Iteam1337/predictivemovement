defmodule Osrm do
  @osrmBase "http://osrm.pm.iteamdev.se/"

  def nearest(lng, lat) do
    Fetch.json("#{@osrmBase}nearest/v1/driving/#{lng},#{lat}")
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
      "#{@osrmBase}route/v1/driving/#{from.lng},#{from.lat};#{to.lng},#{to.lat}?steps=true&alternatives=false&overview=full&annotations=true"

    Fetch.json(url)
    |> Map.get("routes")
    |> Enum.sort(fn a, b -> a.duration < b.duration end)
    |> List.first()

    # |> Map.get("geometry")
  end

  def trip(positions) do
    IO.inspect(positions, label: "positions")

    positions
    |> Enum.map(fn %{"lat" => lat, "lng" => lng} -> %{"pos" => lat} end)

    # const coordinates = positions.map(pos => [pos.lon, pos.lat].join(',')).join(';')

    # return fetch(`${osrmUrl}/trip/v1/driving/${coordinates}?geometries=geojson&annotations=true&source=first&destination=last&overview=full&steps=true`) // Add annotations and steps to get each node speed
    # url =
    #   "#{@osrmBase}route/v1/driving/#{from.lng},#{from.lat};#{to.lng},#{to.lat}?steps=true&alternatives=false&overview=full&annotations=true"
  end
end
