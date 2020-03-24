defmodule CarFinderTest do
  use ExUnit.Case
  doctest CarFinder

  # @tag :only
  @tag :skip
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

    # [%{lat: 61.820701, lon: 16.057731}, %{lat: 61.820701, lon: 16.057731}]
    # [%{lat: 61.820701, lon: 16.057731}, %{lat: 61.755934, lon: 15.972861}]
    # [%{lat: 61.755934, lon: 15.972861}, %{lat: 61.820701, lon: 16.057731}]
    # %{
    #   score: -18412.5,
    #   segment: [
    #     %{lat: 61.755934, lon: 15.972861},
    #     %{lat: 61.820701, lon: 16.057731}
    #   ]
    # }
    # %{
    #   score: -24370.6,
    #   segment: [
    #     %{lat: 61.820701, lon: 16.057731},
    #     %{lat: 61.755934, lon: 15.972861}
    #   ]
    # }
  end

  # @tag :only
  @tag :skip
  test "suggest a booking on the way to the first booking" do
    hub = %{lat: 61.820701, lon: 16.057731}
    letsbo = %{lat: 61.928261, lon: 15.870959}
    sillerbo = %{lat: 61.864581, lon: 15.994193}
    bookingDestination = %{lat: 61.755934, lon: 15.972861}
    somewhereInNore = %{lat: 61.839458, lon: 16.053965}

    firstBooking = %{
      bookingDate: ~U[2020-03-17 08:45:42.045239Z],
      departure: hub,
      destination: letsbo,
      id: 10
    }

    # a booking on the way to Letsbo
    secondBooking = %{
      bookingDate: ~U[2020-03-17 08:45:42.045239Z],
      departure: somewhereInNore,
      destination: sillerbo,
      id: 11
    }

    # [%{lat: 61.820701, lon: 16.057731}, %{lat: 61.820701, lon: 16.057731}]  // hub -> hub to pickup the booking.departure
    # [%{lat: 61.820701, lon: 16.057731}, (HERE), %{lat: 61.928261, lon: 15.870959}]  // firstBooking.departure(hub) -> sec -> firstBooking.destination

    # [%{lat: 61.928261, lon: 15.870959}, %{lat: 61.820701, lon: 16.057731}]  // going back to the hub
    car =
      %{
        busy: false,
        heading: nil,
        id: 1,
        position: hub,
        route: nil
      }
      |> Car.assign(firstBooking)
      # |> Car.assign(secondBooking)
      |> Car.calculateDetours(secondBooking)

    car
    # |> Map.take(fn segment ->
    #   car.assign(segment.booking)
    # end)
    ## we need to know in which order we should assign the bookings
    |> Enum.map(&IO.inspect(&1))

    # [%{lat: 61.820701, lon: 16.057731}, %{lat: 61.820701, lon: 16.057731}]
    # [%{lat: 61.820701, lon: 16.057731}, %{lat: 61.928261, lon: 15.870959}]
    # [%{lat: 61.928261, lon: 15.870959}, %{lat: 61.820701, lon: 16.057731}]
    # %{
    #   score: -20066.7,
    #   segment: [
    #     %{lat: 61.820701, lon: 16.057731},
    #     %{lat: 61.928261, lon: 15.870959}
    #   ],
    #   booking: booking2
    # }
    # %{
    #   score: -33436,
    #   segment: [
    #     %{lat: 61.928261, lon: 15.870959},
    #     %{lat: 61.820701, lon: 16.057731}
    #   ]
    #   booking: booking1
    # }
    ## first take the new booking on the way to nore
    # assert car.bookings == [secondBooking, firstBooking]
  end
end
