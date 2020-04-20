defmodule EngineTest do
  use ExUnit.Case
  use ExUnitProperties

  doctest Engine

  @christian %{lat: 59.338791, lon: 17.897773}
  @radu %{lat: 59.318672, lon: 18.072149}
  @kungstradgarden %{lat: 59.332632, lon: 18.071692}
  @iteam %{lat: 59.343664, lon: 18.069928}
  @ralis %{lat: 59.330513, lon: 18.018228}

  @christianToRadu %{
    departure: @christian,
    destination: @radu,
    id: "christianToRadu"
  }

  @raduToKungstradgarden %{
    departure: @radu,
    destination: @kungstradgarden,
    id: "raduToKungstradgarden"
  }

  @kungstradgardenToRalis %{
    departure: @kungstradgarden,
    destination: @ralis,
    id: "kungstradgardenToRalis"
  }

  @iteamToRadu %{
    departure: @iteam,
    destination: @radu,
    id: "iteamToRadu"
  }

  @iteamToChristian %{
    departure: @iteam,
    destination: @christian,
    id: "iteamToChristian"
  }

  @iteamToKungstradgarden %{
    departure: @iteam,
    destination: @kungstradgarden,
    id: "iteamToKungstradgarden"
  }

  @iteamToRalis %{
    departure: @iteam,
    destination: @ralis,
    id: "iteamToRalis"
  }

  @ralisToIteam %{
    departure: @ralis,
    destination: @iteam,
    id: "ralisToIteam"
  }

  @raduToRalis %{
    departure: @radu,
    destination: @ralis,
    id: "raduToRalis"
  }

  @ralisToChristian %{
    departure: @ralis,
    destination: @christian,
    id: "ralisToChristian"
  }

  @tesla %{
    busy: false,
    heading: nil,
    id: "tesla",
    instructions: [],
    position: @iteam,
    route: nil
  }

  @volvo %{
    busy: false,
    heading: nil,
    id: "volvo",
    instructions: [],
    position: @iteam,
    route: nil
  }

  def pretty(%{cars: cars, assignments: assignments}) do
    assignments
    |> Enum.map(fn %{car: car, booking: booking} ->
      "(#{car.id}) #{booking.id}"
    end)
  end

  def pretty(%{action: action, booking: booking}) do
    "(#{action}) #{booking.id}"
  end

  test "happy path" do
    cars = [@tesla]

    route =
      [@iteamToRadu, @raduToKungstradgarden, @kungstradgardenToRalis]
      |> Engine.find_candidates(cars)
      |> pretty()
      |> Enum.join(" -> ")

    assert route ==
             "(tesla) iteamToRadu -> (tesla) raduToKungstradgarden -> (tesla) kungstradgardenToRalis"
  end

  test "bookings assigned in wrong order" do
    cars = [@tesla]

    candidates1 =
      [@iteamToRadu, @raduToKungstradgarden, @kungstradgardenToRalis]
      |> Engine.find_candidates(cars)

    candidates2 =
      [@raduToKungstradgarden, @iteamToRadu, @kungstradgardenToRalis]
      |> Engine.find_candidates(cars)

    instructions1 =
      candidates1.cars
      |> Enum.map(fn car -> Enum.map(car.instructions, &pretty(&1)) end)

    instructions2 =
      candidates2.cars
      |> Enum.map(fn car -> Enum.map(car.instructions, &pretty(&1)) end)

    assert instructions1 == instructions2

    assert candidates1.score == candidates2.score
  end

  test "bookings with two cars" do
    cars = [@tesla, @volvo]

    route =
      [@iteamToRadu, @iteamToChristian]
      |> Engine.find_candidates(cars)
      |> pretty()
      |> Enum.join(" -> ")

    assert route == "(volvo) iteamToRadu -> (tesla) iteamToChristian"
  end

  test "three bookings with two cars" do
    cars = [@tesla, @volvo]

    route =
      [@iteamToRadu, @iteamToChristian, @raduToKungstradgarden]
      |> Engine.find_candidates(cars)
      |> pretty()
      |> Enum.join(" -> ")

    assert route ==
             "(volvo) iteamToRadu -> (tesla) iteamToChristian -> (volvo) raduToKungstradgarden"
  end

  test "many bookings from the same pickup and same destination" do
    cars = [@tesla, @volvo]

    route =
      [@iteamToRadu, @iteamToRadu, @iteamToRadu, @iteamToRadu, @iteamToRadu]
      |> Engine.find_candidates(cars)
      |> pretty()
      |> Enum.join(" -> ")

    assert route ==
             "(volvo) iteamToRadu -> (volvo) iteamToRadu -> (volvo) iteamToRadu -> (volvo) iteamToRadu -> (volvo) iteamToRadu"
  end

  test "many bookings from the same pickup with different destinations" do
    cars = [@tesla, @volvo]

    route =
      [@iteamToRadu, @iteamToChristian, @iteamToKungstradgarden, @iteamToRalis, @iteamToRadu]
      |> Engine.find_candidates(cars)
      |> pretty()
      |> Enum.join(" -> ")

    assert route ==
             "(volvo) iteamToRadu -> (tesla) iteamToChristian -> (volvo) iteamToKungstradgarden -> (tesla) iteamToRalis -> (volvo) iteamToRadu"
  end

  @tag :skip
  test "two optimal routes with two cars" do
    cars = [@tesla, @volvo]

    route1 = [@iteamToRadu, @raduToRalis, @ralisToIteam]
    route2 = [@iteamToChristian, @ralisToChristian]

    route =
      (route1 ++ route2)
      |> Engine.find_candidates(cars)
      |> pretty()
      |> Enum.join(" -> ")

    assert route ==
             "(volvo) iteamToRadu -> (volvo) raduToRalis -> (volvo) ralisToIteam -> (tesla) iteamToChristian -> (tesla) ralisToChristian"
  end

  @tag :skip
  test "thousands of bookings with two cars" do
    cars = [@tesla, @volvo]

    route =
      0..10
      |> Enum.reduce([], fn i, result ->
        result ++
          [
            @iteamToRadu,
            @iteamToChristian,
            @raduToKungstradgarden,
            @kungstradgardenToRalis,
            @christianToRadu
          ]
      end)
      |> Engine.find_candidates(cars)
      |> pretty()
      |> Enum.join(" -> ")

    assert route ==
             "(volvo) iteamToRadu -> (tesla) iteamToChristian -> (volvo) raduToKungstradgarden"
  end

  test "handle two batches of bookings" do
    cars = [@tesla, @volvo]
    bookingsBatch1 = [@iteamToRadu, @raduToRalis, @ralisToIteam]

    bookingsBatch2 = [@iteamToRadu, @iteamToChristian, @raduToKungstradgarden]

    %{cars: updated_cars} =
      bookingsBatch1
      |> Engine.find_candidates(cars)

    route =
      bookingsBatch2
      |> Engine.find_candidates(updated_cars)
      |> pretty()
      |> Enum.join(" -> ")

    assert route ==
             "(volvo) iteamToRadu -> (volvo) iteamToChristian -> (volvo) raduToKungstradgarden"
  end

  # @tag :window
  # test "window" do
  # window = Flow.Window.global() |> Flow.Window.trigger_every(10)

  # flow = Flow.from_enumerable(1..100) |> Flow.partition(window: window, stages: 1)

  # flow
  # |> Flow.reduce(fn -> 0 end, &(&1 + &2))
  # |> Flow.emit(:state)
  # |> Enum.to_list()
  # |> IO.inspect(label: "result")

  # data = [
  #   {"elixir", 0},
  #   {"elixir", 1_000},
  #   {"erlang", 60_000},
  #   {"concurrency", 3_200_000},
  #   {"elixir", 4_000_000},
  #   {"erlang", 5_000_000},
  #   {"erlang", 6_000_000}
  # ]

  # window =
  #   Flow.Window.fixed(1, :hour, fn {_word, timestamp} ->
  #     IO.inspect(_word, label: "this is a value")
  #     timestamp
  #   end)

  # flow = Flow.from_enumerable(data, max_demand: 5, stages: 1)
  # flow = Flow.partition(flow, window: window, stages: 1)

  # flow =
  #   Flow.reduce(flow, fn -> %{} end, fn {word, _}, acc ->
  #     Map.update(acc, word, 1, &(&1 + 1))
  #   end)

  # flow
  # |> Flow.emit(:state)
  # |> Enum.to_list()
  # |> IO.inspect(label: "result")

  #   hub = %{lat: 61.820701, lon: 16.057731}

  #   window = Flow.Window.global() |> Flow.Window.trigger_every(10)

  #   bookings =
  #     integer()
  #     |> Flow.from_enumerable()
  #     |> Flow.partition(window: window, stages: 1)
  #     |> Flow.map(&BookingSimulator.generate_booking(&1, hub, Address.random(hub)))
  #     |> Enum.take(5)
  #     |> Enum.to_list()
  #     |> IO.inspect(label: "bookings")
  # end

  @tag :only
  test "offer booking to car" do
    hub = %{lat: 61.820701, lon: 16.057731}

    bookings =
      Stream.iterate(0, &(&1 + 1)) |> Stream.map(&Booking.make(&1, hub, Address.random(hub)))

    cars = Stream.iterate(0, &(&1 + 1)) |> Stream.map(&Car.make(&1, hub, false))

    batch_of_bookings =
      bookings
      |> Stream.chunk_every(1)
      |> Enum.take(5)

    first_ten = cars |> Stream.chunk_every(1) |> Enum.take(1)

    batch_of_cars = first_ten ++ first_ten ++ first_ten ++ first_ten ++ first_ten

    accept = fn car, booking ->
      IO.puts("Offer #{booking.id} to #{car.id}")
      true
    end

    delay_and_accept = fn delay ->
      Process.sleep(delay)
      accept
    end

    car_offer = fn car, booking ->
      Car.offer(car, booking, delay_and_accept.(10))
    end

    # TODO: adjust chunk size & total size and then enable the asserts
    # We need to pass chunks to find and offer cars or change the way we pass data from the start()

    # assert length(batch_of_bookings) == 50
    # assert length(batch_of_cars) == 50

    candidates =
      Engine.App.find_and_offer_cars(batch_of_bookings, batch_of_cars, car_offer)
      |> Enum.to_list()

    # assert length(candidates) == 50
  end
end
