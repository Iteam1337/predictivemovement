defmodule SimulatorTest do
  use ExUnit.Case
  doctest Cars

  # test "greets the world" do
  #   assert Simulator.hello() == :world
  # end

  # test "returns an array" do
  #   assert Simulator.array() == []
  # end

  # test "returns a positions as a stream" do
  #   # assert Simulator.positions() == [%{"lat" => 59, "lng" => 18}]
  #   Simulator.positions() |> List.first() |> is_tuple() |> assert
  # end

  # test "generates an address" do
  #   assert Simulator.address(%{lng: 61.829182, lat: 16.0896213}) == []
  # end

  # test "navigateTo responds with a car and route" do
  #   updated_heading =
  #     Car.make(1337, %{lat: 61.829182, lng: 16.0896213}, false)
  #     |> Car.navigateTo(%{lng: 62.829182, lat: 17.05948})
  #     |> Map.take([:heading, :route])

  #   assert updated_heading.heading == %{lng: 62.829182, lat: 17.05948}
  #   assert updated_heading.route["distance"] > 0
  # end

  # test "generates cars" do
  #   center = %{lat: 61.829182, lng: 16.0896213}
  #   cars = Cars.simulate(center, 1337)
  #   assert length(cars) == 4
  # end
  @route %{
    started: 0,
    geometry: %{
      coordinates: [%{lng: 59, lat: 18}, %{lng: 60, lat: 19}, %{lng: 61, lat: 20}]
    },
    legs: [%{
      annotation: %{duration: [1, 2, 1], distance: [1, 2, 3]}
    }]
  }

  test "get coming segments" do

    [current | future] = Interpolate.get_future_segments_from_route(@route, 2)
    assert current == %{duration: 2, passed: 3, coordinates: %{lng: 60, lat: 19}}
    assert future == [%{duration: 1, passed: 4, coordinates: %{lng: 61, lat: 20}}]
  end

  test "get progress" do
    position = Interpolate.get_position_from_route(@route, 2)
    assert position == %{lng: 60.5, lat: 19.5}
  end

  test "position returns current position in the future" do
    car =
      Car.make(1337, %{lng: 16.0896213, lat: 61.829182}, false)
      |> Car.navigateTo(%{lng: 17.05948, lat: 62.829182})
      |> Map.take([:heading, :route])

    position = Car.position(car, DateTime.add(car.route.started, 120, :second))
    assert position.lat > 61.0896213
    assert position.lat < 62.829182
    assert position.lng > 16.0896213
    assert position.lng < 17.05948

    assert position != %{lat: 62.829182, lat: 17.05948}
  end
end
