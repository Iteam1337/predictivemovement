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

  # Given @hub as 0 the furthest away is @letsbo
  #
  # @hub -> @somewhereInNore -> @sillerbo -> @letsbo

  @tag :only
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

    assert car.route
    assert car.route.distance > 0
    assert car.heading
  end

  @tag :only
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

    assert car.route
    assert car.route.distance > 0
    assert car.heading
  end

  @tag :only
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

    assert car.route
    assert car.route.distance > 0
    assert car.heading
  end

  @tag :only
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

    assert car.route
    assert car.route.distance > 0
    assert car.heading
  end

  @tag :only
  test "assign with :auto adds the instructions at the start" do
    # Given @hub as 0 the furthest away is @letsbo
    #
    # @hub -> @somewhereInNore -> @sillerbo -> @letsbo
    firstBooking =
      @firstBooking
      |> Map.put(:departure, @sillerbo)
      |> Map.put(:destination, @letsbo)

    secondBooking =
      @secondBooking
      |> Map.put(:departure, @hub)
      |> Map.put(:destination, @somewhereInNore)

    car =
      %{
        busy: false,
        heading: nil,
        id: 1,
        position: @hub,
        route: nil,
        instructions: []
      }
      |> Car.assign(firstBooking)
      |> Car.assign(secondBooking, :auto)

    assert length(car.instructions) == 4

    assert car.instructions == [
             %{action: :pickup, position: secondBooking.departure, booking: secondBooking},
             %{action: :dropoff, position: secondBooking.destination, booking: secondBooking},
             %{action: :pickup, position: firstBooking.departure, booking: firstBooking},
             %{action: :dropoff, position: firstBooking.destination, booking: firstBooking}
           ]
  end

  @tag :only
  test "assign with :auto adds the instructions at the end" do
    # Given @hub as 0 the furthest away is @letsbo
    #
    # @hub -> @somewhereInNore -> @sillerbo -> @letsbo
    firstBooking =
      @firstBooking
      |> Map.put(:departure, @hub)
      |> Map.put(:destination, @somewhereInNore)

    secondBooking =
      @secondBooking
      |> Map.put(:departure, @sillerbo)
      |> Map.put(:destination, @letsbo)

    car =
      %{
        busy: false,
        heading: nil,
        id: 1,
        position: @hub,
        route: nil,
        instructions: []
      }
      |> Car.assign(firstBooking)
      |> Car.assign(secondBooking, :auto)

    assert length(car.instructions) == 4

    assert car.instructions == [
             %{action: :pickup, position: firstBooking.departure, booking: firstBooking},
             %{action: :dropoff, position: firstBooking.destination, booking: firstBooking},
             %{action: :pickup, position: secondBooking.departure, booking: secondBooking},
             %{action: :dropoff, position: secondBooking.destination, booking: secondBooking}
           ]
  end

  @tag :only
  test "assign with :auto adds new booking between existing instructions if that is the case" do
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
             %{action: :pickup, position: @firstBooking.departure, booking: @firstBooking},
             %{action: :pickup, position: @secondBooking.departure, booking: @secondBooking},
             %{action: :dropoff, position: @secondBooking.destination, booking: @secondBooking},
             %{action: :dropoff, position: @firstBooking.destination, booking: @firstBooking}
           ]
  end

  @tag :skip
  test "assign with :auto can assign pickup and dropoff independent in the instructions list" do
    # Given @hub as 0 the furthest away is @letsbo
    #
    # @hub -> @somewhereInNore -> @sillerbo -> @letsbo
    firstBooking =
      @firstBooking
      |> Map.put(:departure, @hub)
      |> Map.put(:destination, @sillerbo)

    secondBooking =
      @secondBooking
      |> Map.put(:departure, @somewhereInNore)
      |> Map.put(:destination, @letsbo)

    car =
      %{
        busy: false,
        heading: nil,
        id: 1,
        position: @hub,
        route: nil,
        instructions: []
      }
      |> Car.assign(firstBooking)
      |> Car.assign(secondBooking, :auto)

    assert length(car.instructions) == 4

    assert car.instructions == [
             %{action: :pickup, position: firstBooking.departure, booking: firstBooking},
             %{action: :pickup, position: secondBooking.departure, booking: secondBooking},
             %{action: :dropoff, position: firstBooking.destination, booking: firstBooking},
             %{action: :dropoff, position: secondBooking.destination, booking: secondBooking}
           ]
  end

  @tag :only
  test "calculate detour between a previous booking " do
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

    [first | _rest] = Car.calculateDetours(car, @secondBooking)

    [firstInstruction, secondInstruction] = car.instructions
    assert first.after == firstInstruction.position
    assert first.before == secondInstruction.position
    assert first.score != 0
  end
end
