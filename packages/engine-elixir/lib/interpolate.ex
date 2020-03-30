defmodule Interpolate do
  @moduledoc """
  Documentation for `Interpolate`.
  """

  @doc """
  Get future segments from a route after a specific time. Traverses through the legs and annotations and returns a list of
  road segments which is after the time specified. This is used for interpolating positions on the route.

  """
  def get_future_segments_from_route(route, time) do
    route.legs
    |> Enum.flat_map(fn leg -> leg.annotation.duration end)
    # add time passed for each step
    |> Enum.scan(%{passed: 0}, fn a, b -> %{duration: a, passed: b.passed + a} end)
    |> Enum.zip(route.geometry.coordinates)
    |> Enum.filter(fn {annotation, _coordinates} -> annotation.passed >= time end)
    |> Enum.map(fn {annotation, coordinates} -> Map.put(annotation, :coordinates, coordinates) end)
  end

  @doc """
  Get position for a certain time on a certain route. Very useful for simulating movement or
  reenact a certain point in time for a route.

  """
  def get_position_from_route(%{distance: 0, geometry: %{coordinates: [position | _rest]}}, time),
    do: position

  def get_position_from_route(route, time) do
    [current, next] = get_future_segments_from_route(route, time) |> Enum.slice(0..1)

    progress = (time - current.passed + current.duration) / current.duration

    %{
      lon: current.coordinates.lon + (next.coordinates.lon - current.coordinates.lon) * progress,
      lat: current.coordinates.lat + (next.coordinates.lat - current.coordinates.lat) * progress
    }
  end
end
