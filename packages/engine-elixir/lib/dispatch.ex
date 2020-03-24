defmodule Dispatch do
  def evaluate(bookings, cars) do
    bookings
    |> Enum.reduce(%{cars: cars, assignments: []}, fn booking, result ->
      # result.cars at any given step
      #
      # [
      #   %{busy: true, id: 1},
      #   %{busy: true, id: 2},
      #   %{busy: false, id: 3},
      #   %{busy: false, id: 4},
      #   %{busy: false, id: 5}
      # ]

      [candidate | _rest] = CarFinder.find(booking, result.cars)

      IO.inspect(
        %{
          carId: candidate.car.id,
          bookingId: candidate.booking.id
        },
        label: "candidate"
      )

      bestCar = Car.assign(candidate)

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
