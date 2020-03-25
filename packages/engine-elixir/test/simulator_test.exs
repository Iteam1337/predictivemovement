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

    # candidates
    # |> Enum.map(fn t -> MQ.publish("candidates", t) end)

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

  @tag :only
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

    cars =
      1..5
      |> Enum.map(&Car.make(&1, hub, false))

    # Bookings input
    #
    # [
    #   %{
    #     bookingDate: ~U[2020-03-24 12:23:35.179442Z],
    #     departure: %{lat: 61.820701, lon: 16.057731},
    #     destination: %{lat: 61.77255, lon: 15.830661},
    #     id: 1
    #   },
    #   %{
    #     bookingDate: ~U[2020-03-24 12:23:35.209653Z],
    #     departure: %{lat: 61.820701, lon: 16.057731},
    #     destination: %{lat: 61.824813, lon: 16.141744},
    #     id: 2
    #   },
    #   %{
    #     bookingDate: ~U[2020-03-24 12:23:35.239793Z],
    #     departure: %{lat: 61.820701, lon: 16.057731},
    #     destination: %{lat: 61.804667, lon: 15.997163},
    #     id: 3
    #   },
    #   %{
    #     bookingDate: ~U[2020-03-24 12:23:35.267344Z],
    #     departure: %{lat: 61.820701, lon: 16.057731},
    #     destination: %{lat: 61.833353, lon: 15.991674},
    #     id: 4
    #   },
    #   %{
    #     bookingDate: ~U[2020-03-24 12:23:35.294843Z],
    #     departure: %{lat: 61.820701, lon: 16.057731},
    #     destination: %{lat: 61.8505, lon: 15.896769},
    #     id: 5
    #   },
    #   %{
    #     bookingDate: ~U[2020-03-24 12:23:35.354083Z],
    #     departure: %{lat: 61.816209, lon: 15.997938},
    #     destination: %{lat: 61.820701, lon: 16.057731},
    #     id: 6
    #   },
    #   %{
    #     bookingDate: ~U[2020-03-24 12:23:35.389368Z],
    #     departure: %{lat: 61.807592, lon: 15.949106},
    #     destination: %{lat: 61.820701, lon: 16.057731},
    #     id: 7
    #   },
    #   %{
    #     bookingDate: ~U[2020-03-24 12:23:35.416461Z],
    #     departure: %{lat: 61.738137, lon: 15.820339},
    #     destination: %{lat: 61.820701, lon: 16.057731},
    #     id: 8
    #   },
    #   %{
    #     bookingDate: ~U[2020-03-24 12:23:35.491575Z],
    #     departure: %{lat: 61.735243, lon: 16.280783},
    #     destination: %{lat: 61.820701, lon: 16.057731},
    #     id: 9
    #   },
    #   %{
    #     bookingDate: ~U[2020-03-24 12:23:35.517770Z],
    #     departure: %{lat: 61.89081, lon: 15.971181},
    #     destination: %{lat: 61.820701, lon: 16.057731},
    #     id: 10
    #   }
    # ]

    # Cars input
    #
    # [
    #   %Car{
    #     busy: false,
    #     heading: nil,
    #     id: 1,
    #     position: %{lat: 61.820701, lon: 16.057731},
    #     route: nil
    #   },
    #   %Car{
    #     busy: false,
    #     heading: nil,
    #     id: 2,
    #     position: %{lat: 61.820701, lon: 16.057731},
    #     route: nil
    #   },
    #   %Car{
    #     busy: false,
    #     heading: nil,
    #     id: 3,
    #     position: %{lat: 61.820701, lon: 16.057731},
    #     route: nil
    #   },
    #   %Car{
    #     busy: false,
    #     heading: nil,
    #     id: 4,
    #     position: %{lat: 61.820701, lon: 16.057731},
    #     route: nil
    #   },
    #   %Car{
    #     busy: false,
    #     heading: nil,
    #     id: 5,
    #     position: %{lat: 61.820701, lon: 16.057731},
    #     route: nil
    #   }
    # ]

    # Assign the hub cars to every car (probably based on busy)
    # Rest of the bookings, calculateDetours and sort on that to assign a car

    Dispatch.evaluate(bookings, cars)
    |> (fn %{cars: cars, assignments: assignments, score: score} ->
          %{
            assignments:
              assignments
              |> Enum.map(fn %{car: car, booking: booking, score: score} ->
                %{
                  carId: car.id,
                  bookingId: booking.id,
                  score: score
                }
              end),
            score: score
          }
        end).()
    |> IO.inspect(label: "assignment")

    # Output
    #
    # assignment: %{
    #   assignments: [
    #     %{bookingId: 1, carId: 1, score: -26593.2},
    #     %{bookingId: 2, carId: 1, score: -26021.1},
    #     %{bookingId: 3, carId: 1, score: -30888.1},
    #     %{bookingId: 4, carId: 1, score: -37256.5},
    #     %{bookingId: 5, carId: 1, score: -10244.1},
    #     %{bookingId: 6, carId: 2, score: -23727.7},
    #     %{bookingId: 7, carId: 2, score: -27436.699999999997},
    #     %{bookingId: 8, carId: 1, score: -37686.6},
    #     %{bookingId: 9, carId: 2, score: -31508.7},
    #     %{bookingId: 10, carId: 1, score: -42005.4}
    #   ],
    #   score: -293368.10000000003
    # }
  end
end
