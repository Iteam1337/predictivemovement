# iex> defmodule User do
#   ...>   defstruct name: "John", age: 27
#   ...> end

# const car = new Car(32, { lat: 21312, lon: 321321})

defmodule Car do
  defstruct id: 0,
            position: %{lon: 53, lat: 14},
            heading: nil,
            busy: false,
            route: nil

  def make(%{id: id, position: position, heading: heading}) do
    make(id, position, false) |> navigateTo(heading)
  end

  def make(id, position, busy) do
    %Car{id: id, position: position, busy: busy}
  end

  def navigateTo(car, heading), do: navigateTo(car, heading, [])

  def navigateTo(car, heading, next) do
    route =
      Osrm.route(car.position, heading)
      |> Map.put(:started, NaiveDateTime.utc_now())

    heading = Map.put(heading, :route, route)

    car
    |> Map.put(:heading, heading)
    |> Map.put(:route, route)
    |> Map.put(:next, next)

    # |> Map.put(:routes, car.routes ++ [route])
  end

  def position(car), do: position(car, NaiveDateTime.utc_now())

  def position(%{route: nil, position: %{lat: lat, lon: lon}}, _time) do
    %{lat: lat, lon: lon}
  end

  def position(%{route: route}, time) do
    relative_time = NaiveDateTime.diff(time, route.started)
    Interpolate.get_position_from_route(route, relative_time)
  end

  # offer_booking -> assign_booking -> assign_booking()

  def assign(%{car: car, booking: booking}) do
    navigateTo(car, booking.departure)
    |> Map.put(:busy, true)
  end

  def calculateDetours(car, booking) do
    detours =
      ([car.position, car.heading] ++ car.next)

      #  [%{lat: 61.820701, lon: 16.057731}, %{lat: 61.820701, lon: 16.057731}]
      #  [%{lat: 61.820701, lon: 16.057731}, %{lat: 61.755934, lon: 15.972861}]
      #  [%{lat: 61.755934, lon: 15.972861}, %{lat: 61.820701, lon: 16.057731}]


      # car.bookings= [current, next | rest]

      # returns pairs
      |> Enum.chunk_every(2, 1, :discard)
      |> Enum.map(fn x -> x |> Enum.map(fn y -> Map.take(y, [:lat, :lon]) end) |> IO.inspect() end)
      |> Enum.map(fn [a | [b | _rest]] ->
        Osrm.trip([
          a,
          booking.departure,
          booking.destination,
          b
        ])
        |> (fn %{code: "Ok", trips: [detour | _rest]} ->
              %{
                segment: [a, b] |> Enum.map(fn x -> Map.take(x, [:lat, :lon]) end),
                score: Score.calculate(booking, car, detour)
              }
            end).()
      end)
  end
end
