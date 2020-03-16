defmodule Score do
  def calculate(booking, %{route: nil}, detour) do
    detour.distance
  end

  def calculate(booking, %{route: route}, detour) do
    detour.distance - route.distance
  end
end
