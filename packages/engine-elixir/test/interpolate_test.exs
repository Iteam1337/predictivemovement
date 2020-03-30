defmodule InterpolateTest do
  use ExUnit.Case
  doctest CarsSimulator

  @route %{
    started: 0,
    geometry: %{
      coordinates: [%{lon: 59, lat: 18}, %{lon: 60, lat: 19}, %{lon: 61, lat: 20}]
    },
    legs: [
      %{
        annotation: %{duration: [1, 2, 1], distance: [1, 2, 3]}
      }
    ]
  }
  test "get coming segments" do
    [current | future] = Interpolate.get_future_segments_from_route(@route, 2)
    assert current == %{duration: 2, passed: 3, coordinates: %{lon: 60, lat: 19}}
    assert future == [%{duration: 1, passed: 4, coordinates: %{lon: 61, lat: 20}}]
  end

  test "get progress" do
    position = Interpolate.get_position_from_route(@route, 1.5)
    assert position == %{lon: 60.25, lat: 19.25}
  end

  test "moves in correct direction" do
    position1 = Interpolate.get_position_from_route(@route, 2)
    position2 = Interpolate.get_position_from_route(@route, 2.5)

    assert position1.lat < position2.lat
    assert position1.lon < position2.lon
  end

  test "position returns current position in the future" do
    car =
      Car.make(1337, %{lon: 16.0896213, lat: 61.829182}, false)
      |> IO.inspect(label: "car")
      |> Car.navigateTo(%{lon: 17.05948, lat: 62.829182})
      |> Map.take([:heading, :route])

    position = Car.position(car, NaiveDateTime.add(car.route.started, 120, :second))
    assert position.lat > 61.0896213
    assert position.lat < 62.829182
    assert position.lon > 16.0896213
    assert position.lon < 17.05948
  end

  test "position returns current position when no route is present" do
    car = Car.make(1337, %{lon: 16.0896213, lat: 61.829182}, false)

    position = Car.position(car)
    assert position.lon == 16.0896213
    assert position.lat == 61.829182
  end

  test "handles zero distance correctly" do
    route = %{
      distance: 0,
      duration: 0,
      geometry: %{
        coordinates: [
          %{lat: 61.8214, lon: 16.05798},
          %{lat: 61.8214, lon: 16.05798}
        ]
      }
    }

    position = Interpolate.get_position_from_route(route, 0)
    assert position.lon == 16.05798
    assert position.lat == 61.8214
  end
end
