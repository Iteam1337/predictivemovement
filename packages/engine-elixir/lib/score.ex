defmodule Score do
  def calculate(%{route: nil}, booking), do: 0

  def calculate(car, booking) do
    car.route.distance
  end

  def calculateTotalScore(%{cars: cars, assignments: assignments}) do
    %{
      assignments: assignments,
      cars: cars,
      score: cars |> Enum.reduce(0, fn %{score: score}, sum -> sum + score end)
    }
  end
end
