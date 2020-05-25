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
  def closestCars(booking, []), do: []

  def closestCars(booking, cars) do
    cars
    |> Enum.map(fn car -> distance(car, booking) end)
    |> Enum.sort(fn a, b -> a.distance < b.distance end)
    |> Enum.map(fn car -> car.car end)
  end

  @doc """
  find the best suitable cars for a booking
  """
  def find(booking, cars) do
    closestCars(booking, cars)
    |> detourCars(booking)
    |> Enum.take(2)
  end

  def detourCars([], booking), do: []

  def detourCars(cars, booking) do
    cars
    |> Enum.map(fn car ->
      Car.calculateDetours(car, booking)
      |> List.first()
      |> (fn first -> %{car: car, booking: booking, detourDiff: first.detourDiff} end).()
    end)
    |> Enum.sort_by(fn a -> a.detourDiff end, :asc)
  end
end
