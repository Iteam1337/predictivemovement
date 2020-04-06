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

  def start_link(_arg) do
    Task.start_link(__MODULE__, :start, _arg)
  end

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

  def start() do
    hub = %{lat: 61.820701, lon: 16.057731}

    bookings =
      1..5
      |> Stream.map(&Booking.make(&1, hub, Address.random(hub)))

    cars = 1..5 |> Stream.map(&Car.make(&1, hub, false))

    latest_bookings =
      bookings
      |> Stream.chunk_every(5)
      |> Enum.take(1)
      |> List.first()

    latest_cars =
      cars
      |> Stream.chunk_every(5)
      |> Enum.take(1)
      |> List.first()

    candidates =
      Engine.App.find_candidates(latest_bookings, latest_cars)
      |> (fn %{assignments: assignments} -> assignments end).()
      |> Enum.filter(fn %{booking: booking, car: car} -> Dispatch.evaluate(booking, car) end)
      |> Enum.map(fn %{booking: booking, car: car} -> Car.offer(car, booking) end)
      |> IO.inspect(label: "data")

    # cars = Routes.init()
    # bookings = BookingRequests.init()

    # ### -- HERE >>
    # batch_of_bookings =
    #   bookings
    #   |> Enum.filter(&is_nil(&1.assignedCar))
    #   |> Window.of_time(1, :minute)

    # batch_of_cars =
    #   cars
    #   # |> Enum.filter(!&1.full)
    #   |> Window.of_time(1, :minute)

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

    IO.puts("Its alive")

    # cars = Routes.init() |> Enum.take(5)

    # BookingRequests.init()
    # |> Stream.flat_map(fn booking ->
    #   CarFinder.find(booking, cars)
    # end)
    # |> Stream.map(fn %{booking: booking, car: car, detour: detour} ->
    #   Score.score(booking, car, detour)
    # end)
    # |> Stream.map(fn candidates -> MQ.publish("candidates", candidates) end)
    # |> Stream.run()

    # candidates
    # |> IO.inspect(label: "Found new candidateç")
    # |> Enum.map(fn booking -> MQ.publish("candidates", booking) end)
  end
end
