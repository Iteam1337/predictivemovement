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
    RpcServer.init()

    car = %{
      busy: false,
      heading: nil,
      id: 1,
      instructions: [],
      position: @hub,
      route: nil
    }

    hub = %{lat: 61.820701, lon: 16.057731}

    # 1..5
    # |> Enum.map(fn id -> Map.put(car, :id, id) end)
    # |> Enum.map(&Car.offer(&1, hub))
    1..5
    |> Flow.from_enumerable()
    |> Flow.map(fn id -> Map.put(car, :id, id) end)
    |> IO.inspect(label: "offering car")
    |> Flow.map(fn car -> Car.offer(car, hub) end)
    |> Flow.partition()

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

    children = []

    Supervisor.start_link(children, strategy: :one_for_one)
  end
end
