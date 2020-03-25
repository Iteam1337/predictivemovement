defmodule Score do
  def calculate(booking, %{route: nil}, newRoute) do
    -newRoute.distance
  end

  def calculate(booking, %{route: route}, distance) do
    -(distance - route.distance)
  end

  def calculate(booking, %{route: route}, %{ distance: distance }) do
    -(distance - route.distance)
  end

  def calculateTotalScore(%{cars: cars, assignments: assignments}) do
    %{
      assignments: assignments,
      cars: cars,
      score: assignments |> Enum.reduce(0, fn %{score: score}, sum -> sum + score end)
    }
  end
end
