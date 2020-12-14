defmodule Engine.Utils do
  def generate_id do
    alphabet = "abcdefghijklmnopqrstuvwxyz0123456789" |> String.split("", trim: true)

    UUID.uuid4()
    |> Base.encode64(padding: false)
    |> String.replace(["+", "/"], Enum.random(alphabet))
    |> String.slice(0, 8)
    |> String.downcase()
  end
end
