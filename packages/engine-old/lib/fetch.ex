defmodule Fetch do
  def json(url) do
    HTTPoison.get!(url)
    # |> IO.inspect(label: "Fetch #{url}")
    |> Map.get(:body)
    |> Poison.decode!(%{keys: :atoms})
  end
end
