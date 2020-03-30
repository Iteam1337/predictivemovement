defmodule Bookings do
  def generate_random_booking(id, center) do
    departure = Address.random(center)
    destination = Address.random(center)

    %{
      id: id,
      bookingDate: DateTime.utc_now(),
      departure: departure,
      destination: destination
    }
  end

  def simulate(center, size) do
    # 1..size
    # |> Flow.from_enumerable()
    # |> Flow.partition()
    # |> Flow.map(fn x -> generate_random_booking(x, center) end)
    # |> Enum.to_list()

    Stream.interval(5000)
    |> Stream.map(fn x -> generate_random_booking(x, center) end)

  end
end
