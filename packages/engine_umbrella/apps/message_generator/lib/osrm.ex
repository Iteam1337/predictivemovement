defmodule MessageGenerator.Osrm do
  @osrmBase "https://osrm.iteamdev.io/"

  def nearest(%{lon: lon, lat: lat}) do
    HTTPoison.get!("#{@osrmBase}nearest/v1/driving/#{lon},#{lat}")
    |> Map.get(:body)
    |> Jason.decode!(keys: :atoms)
  end
end
