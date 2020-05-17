defmodule Fetch do
  def json(url) do
    HTTPoison.get!(url)
    |> Map.get(:body)
    |> Poison.decode!(keys: :atoms)
  end
end
