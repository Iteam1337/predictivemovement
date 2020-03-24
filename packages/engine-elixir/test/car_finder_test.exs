defmodule CarFinderTest do
  use ExUnit.Case
  doctest CarFinder
  @hub %{lat: 61.820701, lon: 16.057731}

  @letsbo %{lat: 61.928261, lon: 15.870959}
  @sillerbo %{lat: 61.864581, lon: 15.994193}
  @somewhereInNore %{lat: 61.839458, lon: 16.053965}

  @firstBooking %{
    bookingDate: ~U[2020-03-17 08:45:42.045239Z],
    departure: @hub,
    destination: @letsbo,
    id: 10
  }

  # a booking on the way to Letsbo
  @secondBooking %{
    bookingDate: ~U[2020-03-17 08:45:42.045239Z],
    departure: @somewhereInNore,
    destination: @sillerbo,
    id: 11
  }

  @tag :only
  # @tag :skip
  test "assign adds new instructions to an empty car" do
    car =
      %{
        busy: false,
        heading: nil,
        id: 1,
        position: @hub,
        instructions: [],
        route: nil
      }
      |> Car.assign(@firstBooking)

    assert length(car.instructions) == 2

    assert car.instructions == [
             %{action: :pickup, position: @firstBooking.departure, booking: @firstBooking},
             %{action: :dropoff, position: @firstBooking.destination, booking: @firstBooking}
           ]
           assert car.route != nil ## <<<--- continue here..
  end

  test "assign adds new instructions to car with existing instructions" do
    car =
      %{
        busy: false,
        heading: nil,
        id: 1,
        position: @hub,
        instructions: [],
        route: nil
      }
      |> Car.assign(@firstBooking)
      |> Car.assign(@secondBooking)

    assert length(car.instructions) == 4

    assert car.instructions == [
             %{action: :pickup, position: @firstBooking.departure, booking: @firstBooking},
             %{action: :dropoff, position: @firstBooking.destination, booking: @firstBooking},
             %{action: :pickup, position: @secondBooking.departure, booking: @secondBooking},
             %{action: :dropoff, position: @secondBooking.destination, booking: @secondBooking}
           ]
           assert car.route != nil ## <<<--- continue here..
  end

  # @tag :only
  test "assign with index inserts new instructions at given index" do
    car =
      %{
        busy: false,
        heading: nil,
        id: 1,
        position: @hub,
        route: nil,
        instructions: []
      }
      |> Car.assign(@firstBooking)
      |> Car.assign(@secondBooking, 1)

    assert length(car.instructions) == 4

    assert car.instructions == [
             %{action: :pickup, position: @firstBooking.departure, booking: @firstBooking},
             %{action: :pickup, position: @secondBooking.departure, booking: @secondBooking},
             %{action: :dropoff, position: @secondBooking.destination, booking: @secondBooking},
             %{action: :dropoff, position: @firstBooking.destination, booking: @firstBooking}
           ]
           assert car.route != nil ## <<<--- continue here..
  end

  test "assign instructions independent at given indexes" do
    car =
      %{
        busy: false,
        heading: nil,
        id: 1,
        position: @hub,
        route: nil,
        instructions: []
      }
      |> Car.assign(@firstBooking)
      |> Car.assign(@secondBooking, 0, 4)

    assert length(car.instructions) == 4

    assert car.instructions == [
             %{action: :pickup, position: @secondBooking.departure, booking: @secondBooking},
             %{action: :pickup, position: @firstBooking.departure, booking: @firstBooking},
             %{action: :dropoff, position: @firstBooking.destination, booking: @firstBooking},
             %{action: :dropoff, position: @secondBooking.destination, booking: @secondBooking}
           ]
           assert car.route != nil ## <<<--- continue here..
  end

  @tag :skip
  test "assign with :auto adds the instructions at best indexes" do
    car =
      %{
        busy: false,
        heading: nil,
        id: 1,
        position: @hub,
        route: nil,
        instructions: []
      }
      |> Car.assign(@firstBooking)
      |> Car.assign(@secondBooking, :auto)

    assert length(car.instructions) == 4

    assert car.instructions == [
             %{action: :pickup, position: @secondBooking.departure, booking: @secondBooking},
             %{action: :dropoff, position: @secondBooking.destination, booking: @secondBooking},
             %{action: :pickup, position: @firstBooking.departure, booking: @firstBooking},
             %{action: :dropoff, position: @firstBooking.destination, booking: @firstBooking}
           ]
  end

  test "calculate detour between a previous booking " do

    car = %{
      busy: false,
      heading: nil,
      id: 1,
      position: @hub,
      route: nil,
      instructions: []
    } |> Car.assign(@firstBooking)

    [first] = Car.calculateDetours(car, @secondBooking)

    [firstInstruction, secondInstruction] = car.instructions
    assert first.after == firstInstruction
    assert first.before == secondInstruction
    assert first.score != 0
  end
end
