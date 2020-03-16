defmodule SimulatorTest do
  use ExUnit.Case
  doctest CarsSimulator

  # test "greets the world" do
  #   assert Simulator.hello() == :world
  # end

  # test "returns an array" do
  #   assert Simulator.array() == []
  # end

  # test "returns a positions as a stream" do
  #   # assert Simulator.positions() == [%{"lat" => 59, "lon" => 18}]
  #   Simulator.positions() |> List.first() |> is_tuple() |> assert
  # end
  @tag :skip
  test "navigateTo responds with a car and route" do
    updated_heading =
      Car.make(1337, %{lat: 61.829182, lon: 16.0896213}, false)
      |> IO.inspect(label: "car")
      |> Car.navigateTo(%{lat: 62.829182, lon: 17.05948})
      |> Map.take([:heading, :route])

    assert updated_heading.heading.lat == 62.829182
    assert updated_heading.heading.lon == 17.05948
    assert updated_heading.route.distance > 0
  end

  # test "generates cars" do
  #   center = %{lat: 61.829182, lon: 16.0896213}
  #   cars = CarsSimulator.simulate(center, 1337)
  #   assert length(cars) == 4
  # end

  @tag :skip
  test "send cars to Rabbitmq" do
    File.stream!("test/cars.json")
    |> Jaxon.Stream.query([:root, :all])
    |> Enum.map(fn t -> MQ.publish("cars", t) end)
  end

  @tag :skip
  test "sends booking to Rabbitmq" do
    File.stream!("test/bookings.json")
    |> Jaxon.Stream.query([:root, :all])
    ## hack to convert strings to atom from jaxon
    |> Enum.to_list()
    |> Poison.encode!()
    |> Poison.decode!(%{keys: :atoms})
    |> Enum.map(fn t -> MQ.publish("bookings", t) end)
  end

  @tag :skip
  test "finds closest cars for new bookings" do
    #  candidates, pickupOffers, pickup
    candidates =
      File.stream!("test/candidates.json")
      |> Jaxon.Stream.query([:root, :all])
      ## hack to convert strings to atom from jaxon
      |> Enum.to_list()
      |> Poison.encode!()
      |> Poison.decode!(%{keys: :atoms})
      |> Enum.map(fn %{booking: booking, cars: cars} ->
        %{
          booking: booking,
          cars:
            cars
            |> Enum.map(fn %{id: id, positions: [position | [heading | _rest]]} ->
              Car.make(%{id: id, position: position, heading: heading})
            end)
        }
      end)
      |> Enum.map(fn %{booking: booking, cars: cars} ->
        %{booking: booking, cars: CarFinder.find(booking, cars)}
      end)

    [%{booking: _booking, cars: cars} | _rest] = candidates

    candidates
    |> Enum.map(fn t -> MQ.publish("candidates", t) end)

    assert length(cars) == 2
  end

  @tag :skip
  test "find candidates when a booking comes in" do
    queue = "bookings"
    {:ok, connection} = AMQP.Connection.open()
    {:ok, channel} = AMQP.Channel.open(connection)
    AMQP.Queue.declare(channel, queue)

    AMQP.Queue.subscribe(channel, queue, fn booking, _meta ->
      IO.puts("Received a booking: #{booking}")
    end)
  end

  test "generates bookings at SNX hub" do
    hub = %{lat: 61.820701, lon: 16.057731}
    address = Address.random(hub)

    hub_bookings =
      1..5
      |> Enum.map(fn id -> BookingSimulator.generate_booking(id, hub, Address.random(hub)) end)

    return_bookings =
      6..10
      |> Enum.map(fn id -> BookingSimulator.generate_booking(id, Address.random(hub), hub) end)

    bookings = Enum.concat(hub_bookings, return_bookings)

    bookings
    |> Enum.map(fn t -> MQ.publish("bookings", t) end)

    cars =
      1..5
      |> Enum.map(&Car.make(&1, hub, false))

    cars |> Enum.map(fn t -> MQ.publish("cars", t) end)

    # {car: 1, booking: 1}, {car: 2, booking: 2}..]
    # 5 cars at the hub
    # 5 packages at the hub going to random directions
    # 5 packages from random direction coming back to the hub
    # if every car should deliver 1 package from the hub and then pickup 1 package back to the hub

    # for every car calculate score of picking up any package of 0..4 and deliver it to the random address
    # and then go and pickup any package of 5..10 and return it to the hub

    # or find the best booking pairs where booking 1 comes from 0..4 and booking 2 comes from 5..10
    # so for every booking from 0..4 calculate distance to every booking from 5..10

    bookings = [1, 2, 3, 4, 5] |> Enum.map(&%{id: &1})
    cars = [6, 7, 8, 9, 10] |> Enum.map(&%{id: &1})

    bookings
    |> Enum.reduce(%{cars: cars, assignments: []}, fn booking, result ->
      # IO.inspect(result, label: "result")
      candidates = CarFinder.find(booking, result.cars)
      bestCar = Car.assign(candidates[0].car, booking)
      newCars = cars |> Enum.map(fn car -> car.id == bestCar.id ? bestCar : car)

      %{cars: newCars, assignments: result.assignments ++ [%{booking: booking, car: bestCar, score: candidates[0].score}]}
    end)
    |> Enum.map(Score.calculateTotalScore)
    |> Enum.map(&IO.inspect(&1, label: "assignment"))

    #     assignments =
    #       bookings
    #       |> Enum.reduce(fn booking ->
    #         CarFinder.find(booking, cars)

    # bookings: bookings-booking, #[booking | remainder]
    # cars: cars + (car + busy + booking + return),
    # assignments: {bookingId: booking.id, car: car.id}

    # %{
    #   booking: %{
    #     bookingDate: ~U[2020-03-16 15:28:41.803026Z],
    #     departure: %{lat: 61.757418, lon: 15.818581},
    #     destination: %{lat: 61.820701, lon: 16.057731},
    #     id: 10
    #   },
    #   car: %Car{
    #     busy: false,
    #     heading: nil,
    #     id: 2,
    #     position: %{lat: 61.820701, lon: 16.057731},
    #     route: nil
    #   },
    #   detour: 35108.2
    # }

    # end)
    # |> Enum.map(&IO.inspect(&1, label: "assignment"))
  end
end
