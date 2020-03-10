defmodule Cars do
  def generateRandomCar(id, center) do
    departure = Address.random(center)
    destination = Address.random(center)
    generateCar([departure, destination], id)
  end

  def generateCar([departure, destination], id) do
    Car.make(id, departure, false)
    |> Car.navigateTo(destination)
  end

  def simulate(center, size) do
    cars =
      1..size
      |> Flow.from_enumerable()
      |> Flow.partition()
      |> Flow.map(fn x -> generateRandomCar(x, center) end)
      |> Enum.to_list()

    Stream.interval(1000)
    |> Stream.flat_map(fn _ -> cars end)
    |> Stream.map(fn car -> Map.put(car, :position, Car.position(car)) end)
    |> Stream.map(fn car -> Map.take(car, [:position, :id, :heading]) end)
  end
end
