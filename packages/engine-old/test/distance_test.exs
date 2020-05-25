defmodule DistanceTest do
  use ExUnit.Case
  doctest Distance
  @hub %{lat: 61.820701, lon: 16.057731}

  @letsbo %{lat: 61.928261, lon: 15.870959}
  @sillerbo %{lat: 61.864581, lon: 15.994193}
  @somewhereInNore %{lat: 61.839458, lon: 16.053965}

  @firstBooking %{
    departure: @hub,
    destination: @letsbo,
  }

  # a booking on the way to Letsbo
  @secondBooking %{
    departure: @somewhereInNore,
    destination: @sillerbo,
  }

  @tag :only
  test "get the correct birds distance between two bookings " do
    firstBookingDistance = Distance.haversine(@firstBooking.departure, @firstBooking.destination)
    secondBookingDistance = Distance.haversine(@secondBooking.departure, @secondBooking.destination)
    distanceBetweenThem = Distance.haversine(@firstBooking.destination, @secondBooking.departure)

    routeDistance = Distance.haversine([@firstBooking.departure, @firstBooking.destination, @secondBooking.departure, @secondBooking.destination])

    assert firstBookingDistance + secondBookingDistance + distanceBetweenThem == routeDistance
  end
end
