defmodule Engine do
  use Application
  @center %{lat: 61.829182, lon: 16.0896213}

  def start(_type, _args) do
    cars = CarsSimulator.simulate(@center, 10)

    bookings = BookingSimulator.simulate(@center, 1)

    # candidates =
    #   bookings
    #   |> Enum.map(fn booking -> %{booking: booking, cars: CarFinder.find(booking, cars)} end)

    cars
    |> IO.inspect(label: "Found new car")
    |> Stream.map(fn car -> MQ.publish("cars", car) end)
    |> Enum.to_list()

    bookings
    |> IO.inspect(label: "Found new booking")
    |> Stream.map(fn booking -> MQ.publish("bookings", booking) end)
    |> Enum.to_list()

    # candidates
    # |> IO.inspect(label: "Found new candidateç")
    # |> Enum.map(fn booking -> MQ.publish("candidates", booking) end)

    children = []

    Supervisor.start_link(children, strategy: :one_for_one)
  end
end
