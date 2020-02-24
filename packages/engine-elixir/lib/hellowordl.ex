defmodule Hellowordl do
  @moduledoc """
  Documentation for `Flow`.
  """

  @doc """
  Hello world.

  ## Examples

      iex> Hellowordl.hello()
      :world

  """

  # const randomPoint = {
  #   lon: start.lon + (Math.random() - 0.5) / 2,
  #   lat: start.lat + (Math.random() - 0.5) / 5,
  # }
  # // get a correct street address
  # return osrm.nearest(center || randomPoint).then(data => {
  #   // if we randomized in the middle of nowhere, or a street with no name, try again?
  #   if (!data.waypoints || !data.waypoints.length)
  #     return randomize(center, retry - 1)
  #   const nearest = data.waypoints[0]
  #   randomPoint.lon = nearest.location[0]
  #   randomPoint.lat = nearest.location[1]
  #   randomPoint.address = nearest.name
  #   return randomPoint
  # })

  def osrm_address(%{"lon" => lon, "lat" => lat}) do
    IO.inspect({lon, lat}, label: "Sending to OSRM")

    HTTPoison.get!("http://osrm.pm.iteamdev.se/nearest/v1/driving/#{lon},#{lat}")
    |> Map.get(:body)
    |> Poison.decode!()
    |> Map.get("waypoints")
    |> List.first()
    |> Map.get("location")
    |> IO.inspect(label: "location")
    |> (fn [lon, lat] -> {lon, lat} end).()
  end
end
