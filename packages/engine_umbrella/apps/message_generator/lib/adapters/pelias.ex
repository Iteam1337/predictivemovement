defmodule MessageGenerator.Adapters.Pelias do
  def get_address_info_from_coordinates(lat, lon) do
    HTTPoison.get!("https://pelias.iteamdev.io/v1/reverse?point.lat=#{lat}&point.lon=#{lon}")
    |> Map.get(:body)
    |> Jason.decode!()
    |> Map.get("features")
    |> List.first()
    |> Map.get("properties")
    |> Map.take(["name", "county", "street"])
  end
end
