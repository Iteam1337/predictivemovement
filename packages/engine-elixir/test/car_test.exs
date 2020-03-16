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
end
