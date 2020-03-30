defmodule EngineTest do
  use ExUnit.Case
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
end
