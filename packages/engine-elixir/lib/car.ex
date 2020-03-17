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

  def navigateTo(car, heading) do
    route =
      Osrm.route(car.position, heading)
      |> Map.put(:started, NaiveDateTime.utc_now())

    heading = Map.put(heading, :route, route)

    car
    |> Map.put(:heading, heading)
    |> Map.put(:route, route)
  end

  def position(car), do: position(car, NaiveDateTime.utc_now())

  def position(%{route: nil, position: %{lat: lat, lon: lon}}, _time) do
    %{lat: lat, lon: lon}
  end

  def position(%{route: route}, time) do
    relative_time = NaiveDateTime.diff(time, route.started)
    Interpolate.get_position_from_route(route, relative_time)
  end

  def assign(%{car: car, booking: booking}) do
    navigateTo(car, booking.departure)
    |> Map.put(:busy, true)
  end
end
