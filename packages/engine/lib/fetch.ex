defmodule Fetch do
  def json(url) do
    HTTPoison.get!(url)
    |> Map.get(:body)
    |> Poison.decode!(keys: :atoms)
  end

  def json_post(url, body) do
    HTTPoison.post!(url, Poison.encode!(body), [{"Content-Type", "application/json"}])
    |> Map.get(:body)
    |> Poison.decode!(keys: :atoms)
  end
end
