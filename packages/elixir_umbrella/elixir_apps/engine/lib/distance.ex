defmodule Distance do
  def calculate_distance(activities) do
    activities
    |> Enum.reduce(%{shared: 0}, fn %{distance: distance, id: id}, acc ->
      acc |> Map.put(String.to_atom(id), (Map.get(acc, String.to_atom(id)) || 0) + distance)
    end)
  end
end
