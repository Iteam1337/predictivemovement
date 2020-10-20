defmodule Fetch do
  def json(url) do
    HTTPoison.get!(url)
    |> Map.get(:body)
    |> Jason.decode!
  end

  def json_post(url, body) do
    HTTPoison.post!(url, Jason.encode!(body), [{"Content-Type", "application/json"}])
    |> Map.get(:body)
    |> Jason.decode!
  end
end
