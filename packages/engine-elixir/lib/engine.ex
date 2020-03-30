defmodule Engine do
  use Application

  defp score(booking, car, detour) do
    # TODO: change to using Score.calculate instead
    %{booking: booking, car: car, score: detour.diff}
  end

  def find_candidates(bookings, cars) do
    bookings
    |> Enum.reduce(%{cars: cars, assignments: []}, fn booking, result ->
      [candidate | _rest] = CarFinder.find(booking, result.cars)
      scoreBefore = Score.calculate(candidate.car, candidate.booking)
      bestCar = Car.assign(candidate.car, candidate.booking, :auto)
      scoreAfter = Score.calculate(candidate.car, candidate.booking)

      newCars =
        result.cars
        |> Enum.map(fn car ->
          if car.id == bestCar.id, do: bestCar, else: car
        end)

      %{
        cars: newCars,
        assignments: result.assignments ++ [%{booking: booking, car: bestCar}],
        score: scoreAfter - scoreBefore
      }
    end)
    |> Score.calculateTotalScore()
  end

  def start(_type, _args) do
    cars = Routes.init() |> Enum.take(5)

    BookingRequests.init()
    |> Stream.flat_map(fn booking ->
      CarFinder.find(booking, cars)
    end)
    |> Stream.map(fn %{booking: booking, car: car, detour: detour} ->
      Score.score(booking, car, detour)
    end)
    |> Stream.map(fn candidates -> MQ.publish("candidates", candidates) end)
    |> Stream.run()

    # candidates
    # |> IO.inspect(label: "Found new candidateç")
    # |> Enum.map(fn booking -> MQ.publish("candidates", booking) end)

    children = []

    Supervisor.start_link(children, strategy: :one_for_one)
  end
end
