defmodule Dispatch do
  def evaluate(_booking, _car) do
    # TODO: filter based on if the car is full, booking has restrictions etc.
    true
  end

  def find_and_offer_cars(batch_of_bookings, batch_of_cars, ask_driver) do
    Stream.zip(batch_of_bookings, batch_of_cars)
    |> Stream.flat_map(fn {latest_bookings, latest_cars} ->
      find_candidates(latest_bookings, latest_cars)
    end)
    |> Stream.filter(fn %{booking: booking, car: car} -> Dispatch.evaluate(booking, car) end)
    # divide into separate branches and evaluate them in parallell
    # TODO: Revert to this code when YOU understand how Flow works
    # |> Flow.from_enumerable()
    # |> Flow.partition(key: fn %{car: car} -> car.id end)
    # |> Flow.map(fn %{booking: booking, car: car} -> ask_driver.(car, booking) end)
    # |> Flow.filter(fn %{accepted: accepted} -> accepted end)
    # |> Flow.map(fn %{booking: booking, car: car} ->
    #   IO.puts("Car #{car.id} accepted booking #{booking.id}")

    #   # Booking.assign(booking, car) # TODO: we need to use same approach as with ask_driver since this publishes to Q
    # end)

    |> Stream.map(fn %{booking: booking, car: car} -> ask_driver.(car, booking) end)
    |> Stream.filter(fn %{accepted: accepted} -> accepted end)
    |> Stream.map(fn %{booking: booking, car: car} ->
      IO.puts("Car #{car.id} accepted booking #{booking.id}")

      # TODO: we need to use same approach as with ask_driver since this publishes to Q
      Booking.assign(booking, car)
    end)
  end

  def find_candidates(bookings, cars) do
    bookings
    |> Enum.reduce(%{cars: cars, assignments: [], score: 0}, fn booking, result ->
      [candidate | _rest] = CarFinder.find(booking, result.cars)
      scoreBefore = Score.calculate(candidate.car, candidate.booking)

      scoreAfter = candidate.car
      |> Car.assign(candidate.booking, :auto)
      |> Score.calculate(candidate.booking)

      newCars =
        result.cars
        |> Enum.map(fn car ->
          if car.id == candidate.car.id, do: candidate.car, else: car
        end)

      %{
        cars: newCars,
        assignments: result.assignments ++ [%{booking: booking, car: candidate.car}],
        score: result.score + (scoreAfter - scoreBefore)
      }
    end)
    |> (fn %{assignments: assignments} -> assignments end).()
  end
end
