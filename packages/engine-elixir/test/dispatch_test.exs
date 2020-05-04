defmodule DispatchTest do
  use ExUnit.Case

  doctest Dispatch

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

  def pretty(%{assignments: assignments}), do: pretty(assignments)

  def pretty(%{action: action, booking: booking}) do
    "(#{action}) #{booking.id}"
  end

  def pretty(assignments) do
    assignments
    |> Enum.map(fn %{car: car, booking: booking} ->
      "(#{car.id}) #{booking.id}"
    end)
  end

  test "happy path" do
    cars = [@tesla]

    route =
      [@iteamToRadu, @raduToKungstradgarden, @kungstradgardenToRalis]
      |> Dispatch.find_candidates(cars)
      |> pretty()
      |> Enum.join(" -> ")

    assert route ==
             "(tesla) iteamToRadu -> (tesla) raduToKungstradgarden -> (tesla) kungstradgardenToRalis"
  end

  # TODO: find_candidates only returns assignments now, where it used to return cars, score and assignments
  # This test case wants to see that having the same bookings sent in different orders would produce the same score when we evaluate
  @tag :skip
  test "bookings assigned in wrong order" do
    cars = [@tesla]

    candidates1 =
      [@iteamToRadu, @raduToKungstradgarden, @kungstradgardenToRalis]
      |> Dispatch.find_candidates(cars)
      |> pretty()
      |> Enum.join(" -> ")

    candidates2 =
      [@raduToKungstradgarden, @iteamToRadu, @kungstradgardenToRalis]
      |> Dispatch.find_candidates(cars)
      |> pretty()
      |> Enum.join(" -> ")

    instructions1 =
      candidates1.cars
      |> Enum.map(fn car -> Enum.map(car.instructions, &pretty(&1)) end)

    instructions2 =
      candidates2.cars
      |> Enum.map(fn car -> Enum.map(car.instructions, &pretty(&1)) end)

    assert instructions1 == instructions2

    assert candidates1.score == candidates2.score
  end

  @tag :skip
  test "bookings with two cars" do
    cars = [@tesla, @volvo]

    route =
      [@iteamToRadu, @iteamToChristian]
      |> Dispatch.find_candidates(cars)
      |> pretty()
      |> Enum.join(" -> ")

    assert route == "(volvo) iteamToRadu -> (tesla) iteamToChristian"
  end

  test "three bookings with two cars" do
    cars = [@tesla, @volvo]

    route =
      [@iteamToRadu, @iteamToChristian, @raduToKungstradgarden]
      |> Dispatch.find_candidates(cars)
      |> pretty()
      |> Enum.join(" -> ")

    assert route ==
             "(volvo) iteamToRadu -> (tesla) iteamToChristian -> (volvo) raduToKungstradgarden"
  end

  test "many bookings from the same pickup and same destination" do
    cars = [@tesla, @volvo]

    route =
      [@iteamToRadu, @iteamToRadu, @iteamToRadu, @iteamToRadu, @iteamToRadu]
      |> Dispatch.find_candidates(cars)
      |> pretty()
      |> Enum.join(" -> ")

    assert route ==
             "(volvo) iteamToRadu -> (volvo) iteamToRadu -> (volvo) iteamToRadu -> (volvo) iteamToRadu -> (volvo) iteamToRadu"
  end

  test "many bookings from the same pickup with different destinations" do
    cars = [@tesla, @volvo]

    route =
      [@iteamToRadu, @iteamToChristian, @iteamToKungstradgarden, @iteamToRalis, @iteamToRadu]
      |> Dispatch.find_candidates(cars)
      |> pretty()
      |> Enum.join(" -> ")

    assert route ==
             "(volvo) iteamToRadu -> (tesla) iteamToChristian -> (volvo) iteamToKungstradgarden -> (tesla) iteamToRalis -> (volvo) iteamToRadu"
  end

  test "two optimal routes with two cars" do
    cars = [@tesla, @volvo]

    route1 = [@iteamToRadu, @raduToRalis, @ralisToIteam]
    route2 = [@iteamToChristian, @ralisToChristian]

    route =
      (route1 ++ route2)
      |> Dispatch.find_candidates(cars)
      |> pretty()
      |> Enum.join(" -> ")

    assert route ==
             "(volvo) iteamToRadu -> (volvo) raduToRalis -> (volvo) ralisToIteam -> (tesla) iteamToChristian -> (tesla) ralisToChristian"
  end

  # TODO: Did this test ever pass? Do we need it?
  @tag :skip
  test "thousands of bookings with two cars" do
    cars = [@tesla, @volvo]

    route =
      0..1000
      |> Enum.reduce([], fn _i, result ->
        result ++
          [
            @iteamToRadu,
            @iteamToChristian,
            @raduToKungstradgarden,
            @kungstradgardenToRalis,
            @christianToRadu
          ]
      end)
      |> Dispatch.find_candidates(cars)
      |> pretty()
      |> Enum.join(" -> ")

    assert route ==
             "(volvo) iteamToRadu -> (tesla) iteamToChristian -> (volvo) raduToKungstradgarden"
  end

  test "offer booking to car" do
    hub = %{lat: 61.820701, lon: 16.057731}
    chunk_size = 2

    bookings =
      Stream.iterate(0, &(&1 + 1)) |> Stream.map(&Booking.make(&1, hub, Address.random(hub)))

    cars = Stream.iterate(0, &(&1 + 1)) |> Stream.map(&Car.make(&1, hub, false))

    batch_of_bookings = bookings |> Enum.take(chunk_size)

    # first_ten = cars  |> Enum.take(10)

    #  batch_of_cars =  first_ten ++ first_ten ++ first_ten ++ first_ten ++ first_ten
    batch_of_cars = cars |> Enum.take(chunk_size)

    accept = fn car, booking ->
      IO.puts("Offer booking #{booking.id} to car #{car.id}")
      true
    end

    delay_and_accept = fn delay ->
      Process.sleep(delay)
      accept
    end

    car_offer = fn car, booking ->
      Car.offer(car, booking, delay_and_accept.(10))
    end

    assign_booking = fn _booking, _car -> true end

    assert length(batch_of_bookings) == chunk_size
    assert length(batch_of_cars) == chunk_size

    candidates =
      Dispatch.find_and_offer_cars(
        [batch_of_bookings],
        [batch_of_cars],
        car_offer,
        assign_booking
      )
      |> Enum.to_list()

    assert length(candidates) == chunk_size
  end

  test "get batch of cars and bookings using fixed windows" do
    hub = %{lat: 61.820701, lon: 16.057731}
    chunk_size = 2

    bookings =
      Stream.iterate(0, &(&1 + 1))
      |> Stream.map(fn id ->
        Process.sleep(1100)
        %{id: id, type: "booking"}
      end)

    cars =
      Stream.iterate(0, &(&1 + 1))
      |> Stream.map(fn id ->
        Process.sleep(1500)
        %{id: id, type: "car"}
      end)

    booking_window =
      Flow.Window.fixed(5, :second, fn _booking -> :os.system_time(:milli_seconds) end)

    car_window = Flow.Window.fixed(5, :second, fn _car -> :os.system_time(:milli_seconds) end)

    batch_of_bookings =
      bookings
      |> Flow.from_enumerable()
      |> Flow.partition(window: booking_window, stages: 1, max_demand: 1)
      |> Flow.reduce(fn -> [] end, fn e, acc -> [e | acc] end)
      |> Flow.departition(fn -> [] end, &(&1 ++ &2), &Enum.sort/1)
      |> Enum.take(1)
      |> List.first()
      |> IO.inspect(label: "is booking")

    batch_of_cars =
      cars
      |> Flow.from_enumerable()
      |> Flow.partition(window: car_window, stages: 1, max_demand: 1)
      |> Flow.reduce(fn -> [] end, fn e, acc -> [e | acc] end)
      |> Flow.departition(fn -> [] end, &(&1 ++ &2), &Enum.sort/1)
      |> Enum.take(1)
      |> List.first()
      |> IO.inspect(label: "is cars")

    assign_booking = fn _booking, _car -> true end

    assert length(batch_of_bookings) == 4
    assert length(batch_of_cars) == 3
  end

  @tag :flow
  test "offers bookings to cars using fixed windows" do
    hub = %{lat: 61.820701, lon: 16.057731}

    bookings =
      Stream.iterate(0, &(&1 + 1)) |> Stream.map(&Booking.make(&1, hub, Address.random(hub)))

    cars = Stream.iterate(0, &(&1 + 1)) |> Stream.map(&Car.make(&1, hub, false))

    booking_window =
      Flow.Window.fixed(5, :second, fn _booking -> :os.system_time(:milli_seconds) end)

    car_window = Flow.Window.fixed(5, :second, fn _car -> :os.system_time(:milli_seconds) end)

    batch_of_bookings =
      bookings
      |> Flow.from_enumerable()
      |> Flow.partition(window: booking_window, stages: 1, max_demand: 1)
      |> Flow.reduce(fn -> [] end, fn e, acc -> [e | acc] end)
      |> Flow.departition(fn -> [] end, &(&1 ++ &2), &Enum.sort/1)
      |> Enum.take(1)
      |> List.first()
      |> IO.inspect(label: "is bookings")

    batch_of_cars =
      cars
      |> Flow.from_enumerable()
      |> Flow.partition(window: car_window, stages: 1, max_demand: 1)
      |> Flow.reduce(fn -> [] end, fn e, acc -> [e | acc] end)
      |> Flow.departition(fn -> [] end, &(&1 ++ &2), &Enum.sort/1)
      |> Enum.take(1)
      |> List.first()
      |> IO.inspect(label: "is cars")

    accept = fn car, booking ->
      IO.puts("Offer booking #{booking.id} to car #{car.id}")
      true
    end

    delay_and_accept = fn delay ->
      Process.sleep(delay)
      accept
    end

    car_offer = fn car, booking ->
      Car.offer(car, booking, delay_and_accept.(10))
    end

    assign_booking = fn _booking, _car -> true end

    candidates =
      Dispatch.find_and_offer_cars(
        batch_of_bookings,
        batch_of_cars,
        car_offer,
        assign_booking
      )
      |> Enum.take(2)
      |> List.first()

    assert length(candidates) == 2
  end
end
