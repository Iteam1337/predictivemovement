defmodule CarFinder do
  def rad(x) do
    x * Math.pi() / 180
  end

  @doc """

  Calculate birds distance (haversine) from a cars current position to a booking
  """
  def distance(car, %{departure: departure}) do
    distance = Distance.haversine(Car.position(car), departure)
    %{car: car, distance: distance}
  end

  @doc """
  Sort all cars in a list according to birds distance to a booking
  """
  def closestCars(booking, cars) do
    cars
    |> Enum.map(fn car -> distance(car, booking) end)
    |> Enum.sort(fn a, b -> a.distance < b.distance end)
    |> Enum.map(fn car -> car.car end)
  end

  @doc """
  Sort all cars in a list based on the smallest calculated detour from the cars original route
  """
  def detourCars(cars, booking) do
    cars
    |> Enum.map(fn car ->
      Osrm.trip([
        car.position,
        booking.departure,
        booking.destination,
        car.heading || car.position
      ])
      |> (fn %{code: "Ok", trips: [detour | _rest]} ->
            %{
              car: car,
              detour: detour
            }
          end).()
    end)
    |> Enum.map(fn %{car: car, detour: detour} ->
      %{
        car: car,
        booking: booking,
        # detour: Map.put(detour, :diff, Score.calculate(booking, car, detour))
        score: Score.calculate(booking, car, detour)
      }
    end)
    # |> Enum.sort(fn a, b -> a.detour.diff < b.detour.diff end)
    |> Enum.sort_by(fn a -> a.score end, :desc)
    |> Enum.sort_by(fn a -> a.car.busy end, :asc)

    # |> Enum.sort(fn a, b -> a.score < b.score end)
  end

  @doc """
  find the best suitable cars for a booking
  """
  def find(booking, cars) do
    closestCars(booking, cars)
    # |> detourCars(booking)
    |> detourCarsNew(booking)
    |> Enum.take(2)
  end

  def detourCarsNew(cars, booking) do
    cars
    |> Enum.map(fn car ->
      Car.calculateDetours(car, booking)
      |> (fn [first | _rest] -> %{car: car, booking: booking, score: first.score} end).()
    end)
    |> Enum.sort_by(fn a -> a.score end, :desc)
  end
end
