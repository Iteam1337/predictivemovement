defmodule Utils do
  def merge(left, right, reverse) do
    Map.merge(right, left, &resolve/3)
  end
  def merge(left, right) do
    Map.merge(left, right, &resolve/3)
  end
  defp resolve(_key, left = %{}, right = %{}) do
    merge(left, right)
  end

  defp resolve(_key, _left, right) do
    right
  end
end