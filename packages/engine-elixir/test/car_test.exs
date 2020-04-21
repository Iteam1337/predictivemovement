defmodule CarTest do
  use ExUnit.Case
  doctest Car
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

  @firstCar %{
    busy: false,
    heading: nil,
    id: 1,
    instructions: [],
    position: @hub,
    route: nil
  }

  @secondCar %{
    busy: false,
    heading: nil,
    id: 2,
    instructions: [],
    position: @hub,
    route: nil
  }

  # @odengatan_first %{lat: 59.339961, lon: 18.039203}

  # @odengatan_second %{lat: 59.340239, lon: 18.040300}

  # @odengatan_third %{lat: 59.340595, lon: 18.041687}

  # @odengatan_fourth %{lat: 59.340737, lon: 18.042224}

  # @odengatan_fifth %{lat: 59.340835, lon: 18.042632}

  # @odengatan_sixth %{lat: 59.341084, lon: 18.043651}

  # @odengatan_seventh %{lat: 59.341286, lon: 18.044477}

  # @firstToSecond %{
  #   departure: @odengatan_first,
  #   destination: @odengatan_second,
  #   id: "firstToSecond"
  # }

  # @secondToThird %{
  #   departure: @odengatan_second,
  #   destination: @odengatan_third,
  #   id: "secondToThird"
  # }

  # @thirdToFourth %{
  #   departure: @odengatan_third,
  #   destination: @odengatan_fourth,
  #   id: "thirdToFourth"
  # }

  # @fourthToFifth %{
  #   departure: @odengatan_fourth,
  #   destination: @odengatan_fifth,
  #   id: "fourthToFifth"
  # }

  # @fifthToSixth %{
  #   departure: @odengatan_fifth,
  #   destination: @odengatan_sixth,
  #   id: "fifthToSixth"
  # }

  # @volvo %{
  #   busy: false,
  #   heading: nil,
  #   id: "volvo",
  #   instructions: [],
  #   position: @hub,
  #   route: nil
  # }

  # Given @hub as 0 the furthest away is @letsbo
  #
  # @hub -> @somewhereInNore -> @sillerbo -> @letsbo

  ##### <tests-for-old-assign>

  @tag :skip
  test "position with route defined" do
    hub = %{lat: 61.820701, lon: 16.057731}
    heading = %{lat: 61.840701, lon: 16.157731}

    car = Car.make(%{id: 1, position: hub, heading: heading})

    position = Car.position(car)
    assert position == %{lat: 61.8214, lon: 16.05798}
  end

  @tag :skip
  test "current position when the route is nil" do
    hub = %{lat: 61.820701, lon: 16.057731}

    car = Car.make(1, hub, false)

    position = Car.position(car)
    assert position == %{lat: 61.820701, lon: 16.057731}
  end

  @tag :skip
  test "assign a car" do
    booking = %{
      bookingDate: ~U[2020-03-17 08:45:42.045239Z],
      departure: %{lat: 61.755934, lon: 15.972861},
      destination: %{lat: 61.820701, lon: 16.057731},
      id: 10
    }

    [candidate | _rest] = [
      %{
        booking: %{
          bookingDate: ~U[2020-03-17 08:45:42.045239Z],
          departure: %{lat: 61.755934, lon: 15.972861},
          destination: %{lat: 61.820701, lon: 16.057731},
          id: 10
        },
        car: %Car{
          busy: false,
          heading: nil,
          id: 1,
          position: %{lat: 61.820701, lon: 16.057731},
          route: nil
        },
        detour: 25104.3
      },
      %{
        booking: %{
          bookingDate: ~U[2020-03-17 08:45:42.045239Z],
          departure: %{lat: 61.755934, lon: 15.972861},
          destination: %{lat: 61.820701, lon: 16.057731},
          id: 10
        },
        car: %Car{
          busy: false,
          heading: nil,
          id: 2,
          position: %{lat: 61.820701, lon: 16.057731},
          route: nil
        },
        detour: 25104.3
      }
    ]

    car = Car.assign(candidate)
    assert car.busy == true
    assert car.heading.lat == booking.departure.lat
    assert car.heading.lon == booking.departure.lon
  end

  ##### </tests-for-old-assign>

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
    assert first.detourDiff != 0
  end

  test "2 bookings from hub to different points" do
    # @hub -> @somewhereInNore -> @sillerbo -> @letsbo

    firstBooking =
      @firstBooking
      |> Map.put(:departure, @hub)
      |> Map.put(:destination, @somewhereInNore)

    secondBooking =
      @secondBooking
      |> Map.put(:departure, @hub)
      |> Map.put(:destination, @letsbo)

    firstCar = Car.assign(@firstCar, firstBooking)

    [first | _rest] = Car.calculateDetours(firstCar, secondBooking)
    [second | _rest] = Car.calculateDetours(@secondCar, secondBooking)

    assert first.detourDiff < second.detourDiff
  end

  test "first booking from hub to Nore and second booking from Letsbo back to hub" do
    # @hub -> @somewhereInNore -> @sillerbo -> @letsbo

    firstBooking =
      @firstBooking
      |> Map.put(:departure, @hub)
      |> Map.put(:destination, @somewhereInNore)

    secondBooking =
      @secondBooking
      |> Map.put(:departure, @letsbo)
      |> Map.put(:destination, @hub)

    firstCar = Car.assign(@firstCar, firstBooking)

    [first | _rest] = Car.calculateDetours(firstCar, secondBooking)
    [second | _rest] = Car.calculateDetours(@secondCar, secondBooking)

    assert first.detourDiff < second.detourDiff
  end
end
