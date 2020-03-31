defmodule Engine do
  use Application

  defp score(booking, car, detour) do
    # TODO: change to using Score.calculate instead
    %{booking: booking, car: car, score: detour.diff}
  end

  def find_candidates(bookings, cars) do
    bookings
    |> Enum.reduce(%{cars: cars, assignments: [], score: 0}, fn booking, result ->
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
        score: result.score + (scoreAfter - scoreBefore)
      }
    end)
  end

  def start(_type, _args) do
    cars = Routes.init()
    bookings = BookingRequests.init()

    ### -- HERE >>
    batch_of_bookings =
      bookings
      |> Enum.filter(&is_nil(&1.assignedCar))
      |> Window.of_time(1, :minute)

    batch_of_cars =
      cars
      # |> Enum.filter(!&1.full)
      |> Window.of_time(1, :minute)

    # Stream.zip([batch_of_bookings, batch_of_cars])
    # |> Stream.map(fn [bookings, cars] -> find_candidates(bookings, cars) end)
    # |> Stream.map(fn candidates -> MQ.publish(candidates, "candidates") end)
    # |> Stream.run()

    # # candidates = CandidatesStream.init()
    # #  |> Dispatch.evaluateAndFilter() # Evalualtes if the car and booking is ready to be dispatched
    #  |> Stream.map(fn [car, booking] ->
    #   cars
    #     |> Stream.map(fn car -> Car.offer(booking)))
    #     |> Enum.filter(&1.accepted)

    #   , bookings] = CommCentral.communicate(cars, bookings)
    #   MQ.publish(cars, "assignedCars")
    #   MQ.publish(bookings, "assignedBookings")
    # end)

    # candidates
    # |> IO.inspect(label: "Found new candidateç")
    # |> Enum.map(fn booking -> MQ.publish("candidates", booking) end)

    children = []

    Supervisor.start_link(children, strategy: :one_for_one)
  end
end
