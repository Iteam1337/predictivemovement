defmodule Score do
  def calculate(booking, %{route: nil}, detour) do
    -detour.distance
  end

  def calculate(booking, %{route: route}, detour) do
    -(detour.distance - route.distance)
  end

  def calculateTotalScore(%{cars: cars, assignments: assignments}) do
    %{
      assignments: assignments,
      cars: cars,
      score: assignments |> Enum.reduce(0, fn %{score: score}, sum -> sum + score end)
    }
  end
end
