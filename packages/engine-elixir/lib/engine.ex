defmodule Engine.Supervisor do
  use Supervisor

  def start_link(init_arg) do
    Supervisor.start_link(__MODULE__, init_arg, name: __MODULE__)
  end

  @impl true
  def init(_init_arg) do
    children = [Engine.App]

    Supervisor.init(children, strategy: :one_for_one)
  end
end

defmodule Engine.App do
  use Task

  @chunk_size 1

  def start_link(_arg) do
    Task.start_link(__MODULE__, :start, _arg)
  end

  defp score(booking, car, detour) do
    # TODO: change to using Score.calculate instead
    %{booking: booking, car: car, score: detour.diff}
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

      bestCar = Car.assign(candidate.car, candidate.booking, :auto)
      scoreAfter = Score.calculate(bestCar, candidate.booking)

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
    |> (fn %{assignments: assignments} -> assignments end).()
  end

  def start() do
    cars_stream = Routes.init()
    bookings_stream = BookingRequests.init()

    batch_of_bookings =
      bookings_stream
      # time window every minute?
      |> Stream.chunk_every(@chunk_size)

    batch_of_cars =
      cars_stream
      # sliding window of ten minutes?
      |> Stream.chunk_every(@chunk_size)



    Dispatch.find_and_offer_cars(batch_of_bookings, batch_of_cars, &Car.offer/2, &Booking.assign/2)
    |> Stream.run()
  end
end
