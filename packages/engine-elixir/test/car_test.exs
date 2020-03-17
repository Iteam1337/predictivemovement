defmodule CarTest do
  use ExUnit.Case
  doctest Car

  test "position with route defined" do
    hub = %{lat: 61.820701, lon: 16.057731}
    heading = %{lat: 61.840701, lon: 16.157731}

    car = Car.make(%{id: 1, position: hub, heading: heading})

    position = Car.position(car)
    assert position == %{lat: 61.8214, lon: 16.05798}
  end

  test "current position when the route is nil" do
    hub = %{lat: 61.820701, lon: 16.057731}

    car = Car.make(1, hub, false)

    position = Car.position(car)
    assert position == %{lat: 61.820701, lon: 16.057731}
  end

  test "assign a car" do
    booking = %{
      bookingDate: ~U[2020-03-17 08:45:42.045239Z],
      departure: %{lat: 61.755934, lon: 15.972861},
      destination: %{lat: 61.820701, lon: 16.057731},
      id: 10
    }

    [candidate | _rest] = [
      %{
        booking: %{
          bookingDate: ~U[2020-03-17 08:45:42.045239Z],
          departure: %{lat: 61.755934, lon: 15.972861},
          destination: %{lat: 61.820701, lon: 16.057731},
          id: 10
        },
        car: %Car{
          busy: false,
          heading: nil,
          id: 1,
          position: %{lat: 61.820701, lon: 16.057731},
          route: nil
        },
        detour: 25104.3
      },
      %{
        booking: %{
          bookingDate: ~U[2020-03-17 08:45:42.045239Z],
          departure: %{lat: 61.755934, lon: 15.972861},
          destination: %{lat: 61.820701, lon: 16.057731},
          id: 10
        },
        car: %Car{
          busy: false,
          heading: nil,
          id: 2,
          position: %{lat: 61.820701, lon: 16.057731},
          route: nil
        },
        detour: 25104.3
      }
    ]

    car = Car.assign(candidate)
    assert car.busy == true
    assert car.heading.lat == booking.departure.lat
    assert car.heading.lon == booking.departure.lon
  end
end
