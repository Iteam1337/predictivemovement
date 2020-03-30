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

  def pretty(%{cars: cars, assignments: assignments, score: score}) do
    assignments
    |> Enum.map(fn %{car: car, booking: booking, score: score} ->
      "(#{car.id}) #{booking.id}"
    end)
  end

  def pretty(%{action: action, booking: booking}) do
    "(#{action}) #{booking.id}"
  end

  @tag :skip
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
end
