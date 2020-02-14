defmodule Fetch do
  def json(url) do
    HTTPoison.get!(url)
    |> Map.get(:body)
    |> Poison.decode!()
  end
end
