defmodule Interpolate do

  def get_future_segments_from_route(route, time) do
    route.legs
    |> IO.inspect(label: "route")
    |> Enum.flat_map(fn leg -> leg.annotation.duration end)
    |> Enum.scan(%{passed: 0}, fn a, b -> %{duration: a, passed: b.passed + a} end) # add time passed for each step
    |> Enum.zip(route.geometry.coordinates)
    |> Enum.filter(fn {annotation, _coordinates} -> annotation.passed >= time end)
    |> Enum.map(fn {annotation, coordinates} -> Map.put(annotation, :coordinates, coordinates) end)

  end

  def get_position_from_route(route, time) do
    [current, next] = get_future_segments_from_route(route, time) |> Enum.slice(0..1)
    progress = (current.passed - time) / current.duration

    %{
      lng: current.coordinates.lng + (next.coordinates.lng - current.coordinates.lng) * progress,
      lat: current.coordinates.lat + (next.coordinates.lat - current.coordinates.lat) * progress
    }
  end
end
