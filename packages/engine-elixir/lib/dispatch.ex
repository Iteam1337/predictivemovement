defmodule Dispatch do
  def evaluate(bookings, cars) do
    bookings
    |> Enum.reduce(%{cars: cars, assignments: []}, fn booking, result ->
      [candidate | _rest] = CarFinder.find(booking, result.cars)

      bestCar = Car.assign(candidate.car, candidate.booking, :auto)

      newCars =
        result.cars
        |> Enum.map(fn car ->
          if car.id == bestCar.id, do: bestCar, else: car
        end)

      %{
        cars: newCars,
        assignments:
          result.assignments ++ [%{booking: booking, car: bestCar, score: candidate.score}]
      }
    end)
    |> Score.calculateTotalScore()
  end
end
