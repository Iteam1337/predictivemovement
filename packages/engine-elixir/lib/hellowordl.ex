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

  def hello do
    :world
  end

  def array do
    []
  end

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

  def positions do
    File.stream!("data/positions.json")
    |> Jaxon.Stream.query([:root, :all])
    # |> Enum.filter(fn x -> x["lat"] > 52 end)
    |> Stream.map(&osrm_address/1)
    |> Enum.to_list()
  end

  def osrm_address(%{"lng" => lng, "lat" => lat}) do
    IO.inspect({lng, lat}, label: "Sending to OSRM")

    HTTPoison.get!("http://osrm.pm.iteamdev.se/nearest/v1/driving/#{lng},#{lat}")
    |> IO.inspect(label: "OSRM response")
    |> Map.get(:body)
    |> Poison.decode!()
    |> Map.get("waypoints")
    |> List.first()
    |> Map.get("location")
    |> IO.inspect(label: "location")
    |> (fn [lng, lat] -> {lng, lat} end).()
  end
end
