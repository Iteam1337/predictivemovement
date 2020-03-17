defmodule CarFinderTest do
  use ExUnit.Case
  doctest CarFinder

  @tag :only
  test "navigate adds a new route" do
    hub = %{lat: 61.820701, lon: 16.057731}
    bookingDestination = %{lat: 61.755934, lon: 15.972861}

    currentBooking = %{
      bookingDate: ~U[2020-03-17 08:45:42.045239Z],
      departure: hub,
      destination: bookingDestination,
      id: 10
    }

    somewhereInNore = %{lat: 61.839458, lon: 16.053965}

    newBooking = %{
      bookingDate: ~U[2020-03-17 08:45:42.045239Z],
      departure: somewhereInNore,
      destination: hub,
      id: 11
    }

    next = [currentBooking.destination, hub]

    car =
      %{
        busy: false,
        heading: nil,
        id: 1,
        position: hub,
        route: nil
      }
      |> Car.navigateTo(currentBooking.departure, next)
      |> Car.calculateDetours(newBooking)
      |> Enum.map(&IO.inspect(&1))

    # assert car.next != []
  end
end
