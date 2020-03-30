defmodule Score do
  def calculate(%{route: nil}, booking), do: 0

  def calculate(car, booking) do
    car.route.distance
  end
end
