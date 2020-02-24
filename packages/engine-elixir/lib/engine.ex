defmodule Engine do
  use Application
  @center %{lat: 61.829182, lon: 16.0896213}

  def start(_type, _args) do
    cars = CarsSimulator.simulate(@center, 100)
    bookings = BookingSimulator.simulate(@center, 100)
    candidates = bookings |>
      Enum.map(fn booking -> CarFinder.find(booking, cars) end)

    cars
    |> IO.inspect(label: "Found new car")
    |> Enum.map(fn car -> MQ.publish("cars", car) end)

    bookings
    |> IO.inspect(label: "Found new booking")
    |> Enum.map(fn booking -> MQ.publish("bookings", booking) end)

    candidates
    |> IO.inspect(label: "Found new candidateç")
    |> Enum.map(fn booking -> MQ.publish("candidates", booking) end)
  end
end
