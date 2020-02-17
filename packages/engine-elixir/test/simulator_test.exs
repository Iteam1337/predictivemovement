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
  # test "send cars to Rabbitmq" do
  #   File.stream!("test/cars.json")
  #   |> Jaxon.Stream.query([:root, :all])
  #   |> Enum.map(fn t -> MQ.publish("cars", t) end)
  # end

  # test "sends booking to Rabbitmq" do
  #   File.stream!("test/bookings.json")
  #   |> Jaxon.Stream.query([:root, :all])
  #   |> Enum.map(fn t -> MQ.publish("bookings", t) end)
  # end

  test "finds closest cars for new bookings" do
    #  candidates, pickupOffers, pickup
    cars =
      File.stream!("test/candidates.json")
      |> Jaxon.Stream.query([:root, :all])
      |> Enum.map(fn %{"booking" => booking, "cars" => cars} ->
        %{
          booking: booking,
          cars:
            cars
            |> Enum.map(fn %{"id" => id, "positions" => [position | [heading | _rest]]} ->
              Car.make(%{"id" => id, "position" => position, "heading" => heading})
            end)
        }
      end)
      |> Enum.map(fn %{booking: booking, cars: cars} -> CarFinder.find(booking, cars) end)

    assert length(cars) == 1
  end
end
