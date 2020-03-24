defmodule Score do
  def calculate(booking, %{route: nil}, route) do
    -route.distance
  end

  def calculate(booking, %{route: route}, route) do
    -(route.distance - route.distance)
  end

  def calculateTotalScore(%{cars: cars, assignments: assignments}) do
    %{
      assignments: assignments,
      cars: cars,
      score: assignments |> Enum.reduce(0, fn %{score: score}, sum -> sum + score end)
    }
  end
end
