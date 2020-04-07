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
      integer()
      |> Stream.map(&Booking.make(&1, hub, Address.random(hub)))

    cars = integer() |> Stream.map(&Car.make(&1, hub, false))

    latest_bookings =
      bookings
      |> Stream.chunk_every(5)
      |> Enum.take(1)
      |> List.first()

    latest_cars =
      cars
      |> Stream.chunk_every(5)
      |> Enum.take(1)
      |> List.first()


      # latest_bookings = [
      #   %{
      #     bookingDate: "2020-04-07T06:59:35.777990Z",
      #     departure: %{lat: 61.903327, lon: 15.908445},
      #     destination: %{lat: 61.870988, lon: 15.999044},
      #     id: 234
      #   }
      # ]
      # latest_cars = [
      #   %{
      #     __struct__: Car,
      #     busy: false,
      #     heading: %{
      #       lat: 61.919044,
      #       lon: 15.841443,
      #       route: %{
      #         distance: 27027.9,
      #         duration: 2269.3,
      #         geometry: %{
      #           coordinates: [
      #             %{lat: 61.79317, lon: 16.20065},
      #             %{lat: 61.79292, lon: 16.20282},
      #             %{lat: 61.792950000000005, lon: 16.204},
      #             %{lat: 61.79317, lon: 16.20432},
      #             %{lat: 61.7937, lon: 16.204919999999998},
      #             %{lat: 61.79376, lon: 16.204909999999998},
      #             %{lat: 61.79383, lon: 16.204939999999997},
      #             %{lat: 61.79423, lon: 16.205359999999995},
      #             %{lat: 61.79444, lon: 16.204459999999994},
      #             %{lat: 61.79457, lon: 16.203789999999994},
      #             %{lat: 61.79469, lon: 16.203099999999996},
      #             %{lat: 61.79478, lon: 16.202469999999995},
      #             %{lat: 61.79493, lon: 16.201479999999993},
      #             %{lat: 61.79496, lon: 16.20132999999999},
      #             %{lat: 61.79506000000001, lon: 16.20070999999999},
      #             %{lat: 61.79511000000001, lon: 16.20041999999999},
      #             %{lat: 61.79538000000001, lon: 16.19920999999999},
      #             %{lat: 61.79556000000001, lon: 16.19841999999999},
      #             %{lat: 61.79585000000001, lon: 16.19710999999999},
      #             %{lat: 61.79597000000001, lon: 16.196629999999992},
      #             %{lat: 61.79612000000001, lon: 16.19609999999999},
      #             %{lat: 61.79617000000001, lon: 16.19594999999999},
      #             %{lat: 61.79668000000001, lon: 16.19443999999999},
      #             %{lat: 61.79688000000001, lon: 16.19374999999999},
      #             %{lat: 61.79692000000001, lon: 16.19356999999999},
      #             %{lat: 61.797070000000005, lon: 16.19292999999999},
      #             %{lat: 61.79710000000001, lon: 16.19280999999999},
      #             %{lat: 61.79713000000001, lon: 16.19263999999999},
      #             %{lat: 61.79731000000001, lon: 16.19179999999999},
      #             %{lat: 61.79773000000001, lon: 16.18986999999999},
      #             %{lat: 61.79775000000001, lon: 16.189809999999987},
      #             %{lat: 61.79793000000001, lon: 16.18892999999999},
      #             %{lat: 61.79815000000001, lon: 16.18787999999999},
      #             %{lat: 61.798210000000005, lon: 16.187539999999988},
      #             %{lat: 61.79847, lon: 16.186029999999988},
      #             %{lat: 61.79884, lon: 16.183989999999987},
      #             %{lat: 61.79886, lon: 16.183839999999986}
      #           ]
      #         },
      #         legs: [
      #           %{
      #             annotation: %{
      #               datasources: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      #                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      #               distance: [117.323172, 62.248604, 29.945363, 66.689313, 6.583375,
      #                7.7598, 49.751553, 52.865878, 37.99011, 38.491983, 34.713565,
      #                54.53507, 8.634648, 34.549346, 16.178192, 70.626227, 45.816768,
      #                75.805528, 28.674979, 32.836213, 9.691913, 96.93861, 42.785986,
      #                10.505049, 37.408008, 6.891375, 10.123412, 48.479606, 111.357707,
      #                3.707006, 50.437165, 60.571926, 18.693274, 84.775488, 114.970367],
      #               duration: [28.1, 14.9, 4.3, 9.6, 0.6, 0.7, 4.5, 4.8, 3.4, 3.5,
      #                3.1, 4.9, 0.8, 3.1, 1.5, 6.4, 4.1, 6.8, 2.6, 3, 0.9, 8.7, 3.9,
      #                0.9, 3.4, 0.6, 0.9, 4.4, 10, 0.3, 4.5, 5.5, 1.7, 7.6],
      #               metadata: %{datasource_names: ["lua profile"]},
      #               nodes: [3995725146, 3995725147, 3668837185, 3668837184, 431531902,
      #                1363907493, 2902777689, 431531880, 2902378975, 2902378977,
      #                2902378980, 2902378982, 560469315, 4331187127, 3013815670,
      #                2902378986, 3013815681, 560469314, 2902379302, 560469313,
      #                2902379309, 3013815691, 560469311, 2902379319, 4126167435,
      #                2902379326, 4331187128, 4126167444, 3013815703, 3013815706,
      #                2902379358, 560469306],
      #               speed: [4.2, 4.2, 7, 6.9, 11, 11.1, 11.1, 11, 11.2, 11, 11.2,
      #                11.1, 10.8, 11.1, 10.8, 11, 11.2, 11.1, 11, 10.9, 10.8, 11.1, 11,
      #                11.7, 11, 11.5, 11.2, 11, 11.1, 12.4, 11.2],
      #               weight: [28.1, 14.9, 4.3, 9.6, 0.6, 0.7, 4.5, 4.8, 3.4, 3.5, 3.1,
      #                4.9, 0.8, 3.1, 1.5, 6.4, 4.1, 6.8, 2.6, 3, 0.9, 8.7, 3.9, 0.9,
      #                3.4, 0.6, 0.9, 4.4, 10, 0.3]
      #             },
      #             distance: 27027.9,
      #             duration: 2269.3,
      #             steps: [
      #               %{
      #                 distance: 340.3,
      #                 driving_side: "right",
      #                 duration: 69,
      #                 geometry: "i~cxJae{aBp@qLEkFk@_AiBwBK@MEoAsA",
      #                 intersections: [
      #                   %{
      #                     bearings: 'h',
      #                     entry: [true],
      #                     location: [16.200652, 61.793171],
      #                     out: 0
      #                   },
      #                   %{
      #                     bearings: [30, 225, 270],
      #                     entry: [true, true, false],
      #                     in: 2,
      #                     location: [16.204, 61.79295],
      #                     out: 0
      #                   },
      #                   %{
      #                     bearings: [0, 120, 210],
      #                     entry: [true, true, false],
      #                     in: 2,
      #                     location: [16.204921, 61.793701],
      #                     out: 0
      #                   }
      #                 ],
      #                 maneuver: %{
      #                   bearing_after: 104,
      #                   bearing_before: 0,
      #                   location: [16.200652, 61.793171],
      #                   type: "depart"
      #                 },
      #                 mode: "driving",
      #                 name: "",
      #                 weight: 69
      #               },
      #               %{
      #                 distance: 1676.3,
      #                 driving_side: "right",
      #                 duration: 151.1,
      #                 geometry: "}ddxJob|aBi@rDYdCWhCQ|B]dEE\\SzBIx@u@pFc@|Cy@dGW~A]hBI\\eBlHg@hCGb@]~BEVE`@c@fDsA`KCJc@nDk@pEKbAs@lHiAvKC\\IrA_@xFM|AMvASrAiAvHERE\\Kj@eAvGq@jE",
      #                 intersections: [
      #                   %{
      #                     bearings: [30, 120, 210, 300],
      #                     entry: [true, true, false, true],
      #                     in: 2,
      #                     location: [16.205359, 61.79423],
      #                     out: 3
      #                   },
      #                   %{
      #                     bearings: [30, 105, 285],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.201482, 61.794929],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [30, 105, 300],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.200711, 61.795063],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [30, 120, 300],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.199205, 61.795382],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [30, 120, 300],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.195948, 61.796174],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [30, 120, 300],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.191798, 61.797314],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [15, 120, 300],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.189872, 61.797731],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [15, 105, 285],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.187542, 61.798206],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [120, 210, 300],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [16.17918, 61.799708],
      #                     out: 2
      #                   }
      #                 ],
      #                 maneuver: %{
      #                   bearing_after: 295,
      #                   bearing_before: 25,
      #                   location: [16.205359, 61.79423],
      #                   modifier: "left",
      #                   type: "turn"
      #                 },
      #                 mode: "driving",
      #                 name: "Hybo Byväg",
      #                 ref: "X 704",
      #                 weight: 151.1
      #               },
      #               %{
      #                 distance: 957.7,
      #                 driving_side: "right",
      #                 duration: 86.2,
      #                 geometry: "okexJmmvaBgA`Hm@vDw@hD_@vA[lAUdASzAQbBg@bGk@zGe@dDiAdHkBhLu@jEUdAUz@m@zB]bA]v@c@|@",
      #                 intersections: [
      #                   %{
      #                     bearings: [120, 300],
      #                     entry: [false, true],
      #                     in: 0,
      #                     location: [16.176389, 61.800398],
      #                     out: 1
      #                   }
      #                 ],
      #                 maneuver: %{
      #                   bearing_after: 296,
      #                   bearing_before: 296,
      #                   location: [16.176389, 61.800398],
      #                   modifier: "straight",
      #                   type: "new name"
      #                 },
      #                 mode: "driving",
      #                 name: "Hybovägen",
      #                 ref: "X 704",
      #                 weight: 86.2
      #               },
      #               %{
      #                 distance: 1581.1,
      #                 driving_side: "right",
      #                 duration: 142.2,
      #                 geometry: "uefxJcksaB]n@s@bAc@h@i@d@cCdBo@j@c@j@c@p@gFxH_D|EiT|[kAbAcB~@cFxBwBdAg@^e@z@c@hA[`BeDfT",
      #                 intersections: [
      #                   %{
      #                     bearings: [135, 330],
      #                     entry: [false, true],
      #                     in: 0,
      #                     location: [16.16066, 61.804587],
      #                     out: 1
      #                   },
      #                   %{
      #                     bearings: [75, 150, 330],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.156908, 61.807812],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [75, 165, 270, 345],
      #                     entry: [true, false, true, true],
      #                     in: 1,
      #                     location: [16.149903, 61.81404],
      #                     out: 3
      #                   }
      #                 ],
      #                 maneuver: %{
      #                   bearing_after: 322,
      #                   bearing_before: 319,
      #                   location: [16.16066, 61.804587],
      #                   modifier: "straight",
      #                   type: "new name"
      #                 },
      #                 mode: "driving",
      #                 name: "Simanbo Hybovägen",
      #                 ref: "X 704",
      #                 weight: 142.2
      #               },
      #               %{
      #                 distance: 2001,
      #                 driving_side: "right",
      #                 duration: 181,
      #                 geometry: "cnhxJehpaBuAzIaDpS]jBgAlFsAlGGT[~AOj@YnAY~AUdBU`BUdCIv@I`AKhAIxAGfBCdBClBMlGCjAGpAObBUtAUjAS`AS~@a@bAiBxF]bA[lA[tAYpASlAMfAMnAKzAKxACj@GzAKhBOhBU`CSzAU|AYbB}A|GKr@OnAOlB]~Dc@rEWbCGz@Cl@@v@Fx@",
      #                 intersections: [
      #                   %{
      #                     bearings: [120, 300],
      #                     entry: [false, true],
      #                     in: 0,
      #                     location: [16.144827, 61.816179],
      #                     out: 1
      #                   },
      #                   %{
      #                     bearings: [30, 120, 210, 300],
      #                     entry: [true, false, true, true],
      #                     in: 1,
      #                     location: [16.143086, 61.816606],
      #                     out: 3
      #                   },
      #                   %{
      #                     bearings: [120, 210, 300],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [16.136132, 61.818533],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [15, 105, 285],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.133359, 61.819203],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [120, 195, 315],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [16.126254, 61.820119],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [45, 135, 315],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.125907, 61.820287],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [15, 105, 285],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.121033, 61.82174],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [45, 120, 225, 300],
      #                     entry: [true, false, true, true],
      #                     in: 1,
      #                     location: [16.117209, 61.822393],
      #                     out: 3
      #                   },
      #                   %{
      #                     bearings: [15, 120, 300],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.115783, 61.822858],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [120, 195, 300],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [16.115523, 61.822924],
      #                     out: 2
      #                   }
      #                 ],
      #                 maneuver: %{
      #                   bearing_after: 296,
      #                   bearing_before: 296,
      #                   location: [16.144827, 61.816179],
      #                   modifier: "straight",
      #                   type: "new name"
      #                 },
      #                 mode: "driving",
      #                 name: "Hybovägen",
      #                 ref: "X 704",
      #                 weight: 181
      #               },
      #               %{
      #                 distance: 77.8,
      #                 driving_side: "right",
      #                 duration: 12.2,
      #                 geometry: "c|ixJmsiaBc@f@QPi@h@IHQT",
      #                 intersections: [
      #                   %{
      #                     bearings: [75, 180, 330],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [16.110792, 61.823535],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [150, 255, 330],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [16.110592, 61.82372],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [15, 150, 330],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.110499, 61.823807],
      #                     out: 2
      #                   }
      #                 ],
      #                 maneuver: %{
      #                   bearing_after: 331,
      #                   bearing_before: 253,
      #                   location: [16.110792, 61.823535],
      #                   modifier: "right",
      #                   type: "end of road"
      #                 },
      #                 mode: "driving",
      #                 name: "",
      #                 ref: "X 704",
      #                 weight: 12.2
      #               },
      #               %{
      #                 distance: 1124.4,
      #                 driving_side: "right",
      #                 duration: 102,
      #                 geometry: "_`jxJioiaBB~@@dBEfBC~@Cl@MjBUtBa@`CsAhH}@|Dm@`BsAzCITOn@Kj@Il@Gx@Ch@A`@G|AEz@APQpAO|@EVSjAe@rCi@vCQrAu@pEQ~@_AtFkAbIADc@rB?Bw@nCOb@",
      #                 intersections: [
      #                   %{
      #                     bearings: [75, 150, 255, 345],
      #                     entry: [true, false, true, true],
      #                     in: 1,
      #                     location: [16.110131, 61.824161],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [45, 135, 315],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.102737, 61.825933],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [30, 105, 285],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.101271, 61.826244],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [30, 120, 300],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.098453, 61.826812],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [30, 120, 300],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.096219, 61.827376],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [30, 120, 300],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.094668, 61.827785],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [30, 120, 300],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.093017, 61.828177],
      #                     out: 2
      #                   }
      #                 ],
      #                 maneuver: %{
      #                   bearing_after: 260,
      #                   bearing_before: 333,
      #                   location: [16.110131, 61.824161],
      #                   modifier: "left",
      #                   type: "turn"
      #                 },
      #                 mode: "driving",
      #                 name: "Norra Järnvägsgatan",
      #                 ref: "84",
      #                 weight: 102
      #               },
      #               %{
      #                 distance: 566.6,
      #                 driving_side: "right",
      #                 duration: 53.2,
      #                 geometry: "o|jxJ_{eaBGEG?EFEHAN?NBLBJIPs@lDOp@QbAUhA]pBm@|DMhAGl@Ex@Ex@C|@?dABfADfAHv@FdARjBLvALjAJ|@RbAd@bB",
      #                 intersections: [
      #                   %{
      #                     bearings: [15, 135, 225],
      #                     entry: [true, false, false],
      #                     in: 1,
      #                     location: [16.091518, 61.828722],
      #                     out: 0
      #                   },
      #                   %{
      #                     bearings: [30, 135, 285],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.091455, 61.828857],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [45, 195, 300],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [16.091169, 61.828827],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [30, 120, 300],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.090209, 61.829141],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [30, 120, 300],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.089249, 61.829423],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [15, 105, 285],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.08736, 61.829865],
      #                     out: 2
      #                   }
      #                 ],
      #                 maneuver: %{
      #                   bearing_after: 21,
      #                   bearing_before: 309,
      #                   exit: 2,
      #                   location: [16.091518, 61.828722],
      #                   modifier: "straight",
      #                   type: "roundabout turn"
      #                 },
      #                 mode: "driving",
      #                 name: "Norra Järnvägsgatan",
      #                 ref: "84",
      #                 weight: 53.2
      #               },
      #               %{
      #                 distance: 53.9,
      #                 driving_side: "right",
      #                 duration: 7.2,
      #                 geometry: "{_kxJu_daBERAT@TDRFLHBHAHKDQ",
      #                 intersections: [
      #                   %{
      #                     bearings: [45, 150, 300],
      #                     entry: [false, false, true],
      #                     in: 0,
      #                     location: [16.082025, 61.829255],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [60, 210, 315],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [16.081612, 61.829264],
      #                     out: 1
      #                   }
      #                 ],
      #                 maneuver: %{
      #                   bearing_after: 303,
      #                   bearing_before: 230,
      #                   exit: 2,
      #                   location: [16.082025, 61.829255],
      #                   modifier: "right",
      #                   type: "roundabout"
      #                 },
      #                 mode: "driving",
      #                 name: "Kyrkogatan",
      #                 ref: "84",
      #                 weight: 7.2
      #               },
      #               %{
      #                 distance: 457.9,
      #                 driving_side: "right",
      #                 duration: 41.5,
      #                 geometry: "o~jxJo}caBj@hAHNb@x@bAhBb@hATpALzB?rCIzCYhHg@lIAh@",
      #                 intersections: [
      #                   %{
      #                     bearings: [105, 225, 300],
      #                     entry: [true, true, false],
      #                     in: 2,
      #                     location: [16.081683, 61.829037],
      #                     out: 1
      #                   },
      #                   %{
      #                     bearings: [0, 90, 285],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.078273, 61.827892],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [105, 195, 285],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [16.077486, 61.827941],
      #                     out: 2
      #                   }
      #                 ],
      #                 maneuver: %{
      #                   bearing_after: 219,
      #                   bearing_before: 123,
      #                   exit: 2,
      #                   location: [16.081683, 61.829037],
      #                   modifier: "right",
      #                   type: "exit roundabout"
      #                 },
      #                 mode: "driving",
      #                 name: "Kyrkogatan",
      #                 ref: "84",
      #                 weight: 41.5
      #               },
      #               %{
      #                 distance: 404.1,
      #                 driving_side: "right",
      #                 duration: 36.5,
      #                 geometry: "wyjxJgnbaBUZUZQ`@QX]xBMv@Q`AMd@Q^[^wJpK",
      #                 intersections: [
      #                   %{
      #                     bearings: [90, 225, 330],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [16.074116, 61.828277],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [30, 150, 300],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.073535, 61.828676],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [60, 135, 255, 330],
      #                     entry: [true, false, true, true],
      #                     in: 1,
      #                     location: [16.071973, 61.829145],
      #                     out: 3
      #                   }
      #                 ],
      #                 maneuver: %{
      #                   bearing_after: 329,
      #                   bearing_before: 272,
      #                   location: [16.074116, 61.828277],
      #                   modifier: "right",
      #                   type: "continue"
      #                 },
      #                 mode: "driving",
      #                 name: "Kyrkogatan",
      #                 ref: "83",
      #                 weight: 36.5
      #               },
      #               %{
      #                 distance: 2769.5,
      #                 driving_side: "right",
      #                 duration: 192,
      #                 geometry: "ykkxJgsaaBg@`@eBlAuAl@g@TcBr@q@\\kB~AiAjAy@x@o@r@i@v@k@fAc@~@c@nA}@fD}@bDcAzDg@pBi@pBk@pBIl@G^OnAOnBKjBc@jIi@pIK`BSrD[pEw@`HG^k@tEMfAa@~DYpDI`BGjAKjCExC?rCFjEF|CNpCFlA~@tIRrAnD|URvAfEnYpC`RdAhHF^ThBLt@",
      #                 intersections: [
      #                   %{
      #                     bearings: [150, 345],
      #                     entry: [false, true],
      #                     in: 0,
      #                     location: [16.0698, 61.831166],
      #                     out: 1
      #                   },
      #                   %{
      #                     bearings: [60, 165, 330],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.068486, 61.833264],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [30, 135, 315],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.065722, 61.835485],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [30, 120, 315],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.06198, 61.83686],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [15, 105, 285],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.057863, 61.837567],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [15, 105, 285],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.055682, 61.837838],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [105, 240, 300],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [16.052275, 61.838361],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [30, 120, 300],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.052122, 61.838399],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [15, 120, 300],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.051053, 61.838616],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [105, 210, 285],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [16.048351, 61.839038],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [75, 180, 255],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [16.043218, 61.839014],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [75, 240, 330],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [16.041123],
      #                     out: 1
      #                   },
      #                   %{
      #                     bearings: [60, 150, 240],
      #                     entry: [false, true],
      #                     in: 0,
      #                     location: []
      #                   },
      #                   %{bearings: [60, 240], entry: [false], in: 0},
      #                   %{bearings: [60], entry: []},
      #                   %{bearings: []}
      #                 ],
      #                 maneuver: %{
      #                   bearing_after: 337,
      #                   bearing_before: 331,
      #                   location: [16.0698, 61.831166],
      #                   modifier: "straight",
      #                   type: "new name"
      #                 },
      #                 mode: "driving",
      #                 name: "Ramsjövägen",
      #                 ref: "83",
      #                 weight: 192
      #               },
      #               %{
      #                 distance: 2881,
      #                 driving_side: "right",
      #                 duration: 216.5,
      #                 geometry: "melxJyfy`Bf@fDRpBN`BVlC@b@RvDFlBFrB@vABlBApBA|AClBIdDIfBIvBQ`C_@jE[bCw@pFk@|DgChQ]|Bu@bFQ|AIl@e@xDi@xEQbBCPOdAOx@a@|Ao@lB]l@a@p@cB|Au@d@o@V{@\\cAPs@F[@S@m@Am@Ec@EkBa@i@IeCo@sBw@UG_@Gy@CS@]DWDWH}Bz@iBz@]XOPQRINS\\Sd@kB~Dc@|@QVW\\e@d@_@b@k@j@i@l@UZYh@]r@Qh@cApBk@fAwA|ByArBs@t@y@p@OJgBrA",
      #                 intersections: [
      #                   %{
      #                     bearings: [60, 240],
      #                     entry: [false, true],
      #                     in: 0,
      #                     location: [16.026851, 61.83527],
      #                     out: 1
      #                   },
      #                   %{
      #                     bearings: [75, 255, 345],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [16.02406, 61.834759],
      #                     out: 1
      #                   },
      #                   %{
      #                     bearings: [90, 195, 270],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [16.019429, 61.834589],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [30, 120, 300],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [16.007587, 61.836867],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [120, 210, 300],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [16.006658, 61.837057],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [120, 195, 300],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [16.004628, 61.837464],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [120, 195, 300],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [16.004342, 61.837538],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [60, 150, 330],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [15.999673, 61.846772],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [135, 240, 315],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [15.998034, 61.848034],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [165, 225, 345],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [15.995308, 61.850108],
      #                     out: 2
      #                   }
      #                 ],
      #                 maneuver: %{
      #                   bearing_after: 243,
      #                   bearing_before: 241,
      #                   location: [16.026851, 61.83527],
      #                   modifier: "straight",
      #                   type: "new name"
      #                 },
      #                 mode: "driving",
      #                 name: "Heden Ramsjövägen",
      #                 ref: "83",
      #                 weight: 216.5
      #               },
      #               %{
      #                 distance: 2184,
      #                 driving_side: "right",
      #                 duration: 123,
      #                 geometry: "meoxJa_s`BqBxA{EfCwCxB_A|@g@b@a@f@qAlAoA`AqAx@eCpAmCpCsHbJmFpGgApAk@r@_AnAcBrCgAlB[f@c@j@[Vm@d@}@l@c@N_Ab@wAb@s@LsBPE?gAFu@F{AJaBTy@Rs@\\a@Zk@f@e@h@]\\a@X[Na@Li@JmBTuCZqAP",
      #                 intersections: [
      #                   %{
      #                     bearings: [165, 345],
      #                     entry: [false, true],
      #                     in: 0,
      #                     location: [15.994885, 61.850626],
      #                     out: 1
      #                   },
      #                   %{
      #                     bearings: [75, 165, 345],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [15.994435, 61.851198],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [105, 150, 240, 330],
      #                     entry: [true, false, true, true],
      #                     in: 1,
      #                     location: [15.992659, 61.853578],
      #                     out: 3
      #                   },
      #                   %{
      #                     bearings: [30, 165, 330],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [15.991035, 61.855636],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [60, 150, 330],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [15.988529, 61.857885],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [150, 240, 330],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [15.987164, 61.85908],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [0, 75, 180],
      #                     entry: [true, true, false],
      #                     in: 2,
      #                     location: [15.983203, 61.864006],
      #                     out: 0
      #                   },
      #                   %{
      #                     bearings: [0, 15, 180],
      #                     entry: [true, true, false],
      #                     in: 2,
      #                     location: [15.981445, 61.868495],
      #                     out: 0
      #                   }
      #                 ],
      #                 maneuver: %{
      #                   bearing_after: 338,
      #                   bearing_before: 338,
      #                   location: [15.994885, 61.850626],
      #                   modifier: "straight",
      #                   type: "new name"
      #                 },
      #                 mode: "driving",
      #                 name: "Pållamon Ramsjövägen",
      #                 ref: "83",
      #                 weight: 123
      #               },
      #               %{
      #                 distance: 7278.1,
      #                 driving_side: "right",
      #                 duration: 450.8,
      #                 geometry: "uwrxJojp`BUBUFiAb@g@Zm@f@}@x@iDnDi@j@m@z@m@dAiAtBy@bBuApD?@o@~B[hBSfBMnAEr@Et@GvAWbMCx@[dOCnA?|AA~@@jAD|AT`ID|C@bDAlAC~@Ez@MvAWjBY|Ae@dB_ApCm@~AgJ~VwC~H]~@WbA]pA]jBc@zCQlAYnBo@nCcBfGyAbFwB|G[dAsh@~bB_@jAoA~DqDpLuA|Eq@pCk@|Cm@~Ck@rEa@lD]`FEx@iA|YaAtRSjBQzAc@~Be@pBe@lA_@j@e@j@k@\\o@XwHp@kBTSDc@L_@Jg@Vc@d@a@f@]p@]t@_@jAe@lBu@jC[xASv@mAnEk@dBaAxB_BpC{@nAaAfAq@v@uLdLA@MJIHiSrRaC|BgBbBgAhAu@|@s@lAy@~AiC|F{@pBoEzJOZQ^g@`Ac@t@_AnASTeCfCs@l@",
      #                 intersections: [
      #                   %{
      #                     bearings: [0, 180],
      #                     entry: [true, false],
      #                     in: 1,
      #                     location: [15.981359, 61.868905],
      #                     out: 0
      #                   },
      #                   %{
      #                     bearings: [135, 150, 330],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [15.979385, 61.871295],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [30, 90, 210, 270],
      #                     entry: [true, false, true, true],
      #                     in: 1,
      #                     location: [15.97143, 61.873621],
      #                     out: 3
      #                   },
      #                   %{
      #                     bearings: [75, 180, 345],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [15.907935, 61.894366],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [165, 255, 345],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [15.907841, 61.894654],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [45, 120, 315],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [15.905819, 61.89601],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [45, 120, 225, 315],
      #                     entry: [true, false, true, true],
      #                     in: 1,
      #                     location: [15.904668, 61.896415],
      #                     out: 3
      #                   },
      #                   %{
      #                     bearings: [135, 255, 315],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [15.890574, 61.907732],
      #                     out: 2
      #                   },
      #                   %{
      #                     bearings: [45, 135, 225, 330],
      #                     entry: [true, false, true],
      #                     in: 1,
      #                     location: [15.888528],
      #                     out: 3
      #                   },
      #                   %{
      #                     bearings: [60, 150, 330],
      #                     entry: [true, false],
      #                     in: 1,
      #                     location: []
      #                   },
      #                   %{bearings: [150, 210], entry: [false], in: 0}
      #                 ],
      #                 maneuver: %{
      #                   bearing_after: 354,
      #                   bearing_before: 352,
      #                   location: [15.981359, 61.868905],
      #                   modifier: "straight",
      #                   type: "new name"
      #                 },
      #                 mode: "driving",
      #                 name: "Skogsta Ramsjövägen",
      #                 ref: "83",
      #                 weight: 450.8
      #               },
      #               %{
      #                 distance: 2465.2,
      #                 driving_side: "right",
      #                 duration: 354.8,
      #                 geometry: "u|zxJux}_BTnB^pCPvCF|A?pCEbBIpBQhBIn@Gb@Kr@o@xDq@rEShBMt@Ol@]fAc@fBi@zCQtASvBW|CGzACjECpAIvAGv@g@lDUnCGnAQ~CMnCGxAIlJAbFCvBGvBYfCmBbL_B|H}BbOkBlIuA`EeE`IcAlB_@hBQ|CChKEzDEjEK|HWvE",
      #                 intersections: [
      #                   %{
      #                     bearings: [150, 255, 330],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [15.886348, 61.910666],
      #                     out: 1
      #                   },
      #                   %{
      #                     bearings: [105, 270, 315],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [15.850514, 61.91736],
      #                     out: 1
      #                   }
      #                 ],
      #                 maneuver: %{
      #                   bearing_after: 247,
      #                   bearing_before: 336,
      #                   location: [15.886348, 61.910666],
      #                   modifier: "left",
      #                   type: "turn"
      #                 },
      #                 mode: "driving",
      #                 name: "Störsbäcksvägen",
      #                 weight: 354.8
      #               },
      #               %{
      #                 distance: 208.8,
      #                 driving_side: "right",
      #                 duration: 50.1,
      #                 geometry: "ch|xJmou_B]z@_@v@[b@Wv@c@rA[bA_Ap@[d@Ml@",
      #                 intersections: [
      #                   %{
      #                     bearings: [105, 285, 315],
      #                     entry: [false, true, true],
      #                     in: 0,
      #                     location: [15.843911, 61.917615],
      #                     out: 2
      #                   }
      #                 ],
      #                 maneuver: %{
      #                   bearing_after: 316,
      #                   bearing_before: 282,
      #                   location: [15.843911, 61.917615],
      #                   modifier: "slight right",
      #                   type: "turn"
      #                 },
      #                 mode: "driving",
      #                 name: "",
      #                 weight: 100.3
      #               },
      #               %{
      #                 distance: 0,
      #                 driving_side: "right",
      #                 duration: 0,
      #                 geometry: "_q|xJ_`u_B",
      #                 intersections: [
      #                   %{
      #                     bearings: '}',
      #                     entry: [true],
      #                     in: 0,
      #                     location: [15.841443, 61.919044]
      #                   }
      #                 ],
      #                 maneuver: %{
      #                   bearing_after: 0,
      #                   bearing_before: 305,
      #                   location: [15.841443, 61.919044],
      #                   type: "arrive"
      #                 },
      #                 mode: "driving",
      #                 name: "",
      #                 weight: 0
      #               }
      #             ],
      #             summary: "Hybovägen, Störsbäcksvägen",
      #             weight: 2319.5
      #           }
      #         ],
      #         started: ~N[2020-04-07 07:00:52.809246],
      #         weight: 2319.5,
      #         weight_name: "routability"
      #       }
      #     },
      #     id: 1,
      #     instructions: [],
      #     next: [],
      #     position: %{lat: 61.79317391566265, lon: 16.20065325301205},
      #     route: %{
      #       distance: 27027.9,
      #       duration: 2269.3,
      #       geometry: %{
      #         coordinates: [
      #           %{lat: 61.79317, lon: 16.20065},
      #           %{lat: 61.79292, lon: 16.20282},
      #           %{lat: 61.792950000000005, lon: 16.204},
      #           %{lat: 61.79317, lon: 16.20432},
      #           %{lat: 61.7937, lon: 16.204919999999998},
      #           %{lat: 61.79376, lon: 16.204909999999998},
      #           %{lat: 61.79383, lon: 16.204939999999997},
      #           %{lat: 61.79423, lon: 16.205359999999995},
      #           %{lat: 61.79444, lon: 16.204459999999994},
      #           %{lat: 61.79457, lon: 16.203789999999994},
      #           %{lat: 61.79469, lon: 16.203099999999996},
      #           %{lat: 61.79478, lon: 16.202469999999995},
      #           %{lat: 61.79493, lon: 16.201479999999993},
      #           %{lat: 61.79496, lon: 16.20132999999999},
      #           %{lat: 61.79506000000001, lon: 16.20070999999999},
      #           %{lat: 61.79511000000001, lon: 16.20041999999999},
      #           %{lat: 61.79538000000001, lon: 16.19920999999999},
      #           %{lat: 61.79556000000001, lon: 16.19841999999999},
      #           %{lat: 61.79585000000001, lon: 16.19710999999999},
      #           %{lat: 61.79597000000001, lon: 16.196629999999992},
      #           %{lat: 61.79612000000001, lon: 16.19609999999999},
      #           %{lat: 61.79617000000001, lon: 16.19594999999999},
      #           %{lat: 61.79668000000001, lon: 16.19443999999999},
      #           %{lat: 61.79688000000001, lon: 16.19374999999999},
      #           %{lat: 61.79692000000001, lon: 16.19356999999999},
      #           %{lat: 61.797070000000005, lon: 16.19292999999999},
      #           %{lat: 61.79710000000001, lon: 16.19280999999999},
      #           %{lat: 61.79713000000001, lon: 16.19263999999999},
      #           %{lat: 61.79731000000001, lon: 16.19179999999999},
      #           %{lat: 61.79773000000001, lon: 16.18986999999999},
      #           %{lat: 61.79775000000001, lon: 16.189809999999987},
      #           %{lat: 61.79793000000001, lon: 16.18892999999999},
      #           %{lat: 61.79815000000001, lon: 16.18787999999999},
      #           %{lat: 61.798210000000005, lon: 16.187539999999988},
      #           %{lat: 61.79847, lon: 16.186029999999988},
      #           %{lat: 61.79884}

      #         ]
      #       },
      #       legs: [
      #         %{
      #           annotation: %{
      #             datasources: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      #              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      #             distance: [117.323172, 62.248604, 29.945363, 66.689313, 6.583375,
      #              7.7598, 49.751553, 52.865878, 37.99011, 38.491983, 34.713565,
      #              54.53507, 8.634648, 34.549346, 16.178192, 70.626227, 45.816768,
      #              75.805528, 28.674979, 32.836213, 9.691913, 96.93861, 42.785986,
      #              10.505049, 37.408008, 6.891375, 10.123412, 48.479606, 111.357707,
      #              3.707006, 50.437165, 60.571926, 18.693274],
      #             duration: [28.1, 14.9, 4.3, 9.6, 0.6, 0.7, 4.5, 4.8, 3.4, 3.5, 3.1,
      #              4.9, 0.8, 3.1, 1.5, 6.4, 4.1, 6.8, 2.6, 3, 0.9, 8.7, 3.9, 0.9, 3.4,
      #              0.6, 0.9, 4.4, 10, 0.3, 4.5, 5.5],
      #             metadata: %{datasource_names: ["lua profile"]},
      #             nodes: [3995725146, 3995725147, 3668837185, 3668837184, 431531902,
      #              1363907493, 2902777689, 431531880, 2902378975, 2902378977,
      #              2902378980, 2902378982, 560469315, 4331187127, 3013815670,
      #              2902378986, 3013815681, 560469314, 2902379302, 560469313,
      #              2902379309, 3013815691, 560469311, 2902379319, 4126167435,
      #              2902379326, 4331187128, 4126167444, 3013815703, 3013815706],
      #             speed: [4.2, 4.2, 7, 6.9, 11, 11.1, 11.1, 11, 11.2, 11, 11.2, 11.1,
      #              10.8, 11.1, 10.8, 11, 11.2, 11.1, 11, 10.9, 10.8, 11.1, 11, 11.7,
      #              11, 11.5, 11.2, 11, 11.1],
      #             weight: [28.1, 14.9, 4.3, 9.6, 0.6, 0.7, 4.5, 4.8, 3.4, 3.5, 3.1,
      #              4.9, 0.8, 3.1, 1.5, 6.4, 4.1, 6.8, 2.6, 3, 0.9, 8.7, 3.9, 0.9, 3.4,
      #              0.6, 0.9, 4.4]
      #           },
      #           distance: 27027.9,
      #           duration: 2269.3,
      #           steps: [
      #             %{
      #               distance: 340.3,
      #               driving_side: "right",
      #               duration: 69,
      #               geometry: "i~cxJae{aBp@qLEkFk@_AiBwBK@MEoAsA",
      #               intersections: [
      #                 %{
      #                   bearings: 'h',
      #                   entry: [true],
      #                   location: [16.200652, 61.793171],
      #                   out: 0
      #                 },
      #                 %{
      #                   bearings: [30, 225, 270],
      #                   entry: [true, true, false],
      #                   in: 2,
      #                   location: [16.204, 61.79295],
      #                   out: 0
      #                 },
      #                 %{
      #                   bearings: [0, 120, 210],
      #                   entry: [true, true, false],
      #                   in: 2,
      #                   location: [16.204921, 61.793701],
      #                   out: 0
      #                 }
      #               ],
      #               maneuver: %{
      #                 bearing_after: 104,
      #                 bearing_before: 0,
      #                 location: [16.200652, 61.793171],
      #                 type: "depart"
      #               },
      #               mode: "driving",
      #               name: "",
      #               weight: 69
      #             },
      #             %{
      #               distance: 1676.3,
      #               driving_side: "right",
      #               duration: 151.1,
      #               geometry: "}ddxJob|aBi@rDYdCWhCQ|B]dEE\\SzBIx@u@pFc@|Cy@dGW~A]hBI\\eBlHg@hCGb@]~BEVE`@c@fDsA`KCJc@nDk@pEKbAs@lHiAvKC\\IrA_@xFM|AMvASrAiAvHERE\\Kj@eAvGq@jE",
      #               intersections: [
      #                 %{
      #                   bearings: [30, 120, 210, 300],
      #                   entry: [true, true, false, true],
      #                   in: 2,
      #                   location: [16.205359, 61.79423],
      #                   out: 3
      #                 },
      #                 %{
      #                   bearings: [30, 105, 285],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.201482, 61.794929],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [30, 105, 300],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.200711, 61.795063],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [30, 120, 300],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.199205, 61.795382],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [30, 120, 300],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.195948, 61.796174],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [30, 120, 300],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.191798, 61.797314],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [15, 120, 300],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.189872, 61.797731],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [15, 105, 285],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.187542, 61.798206],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [120, 210, 300],
      #                   entry: [false, true, true],
      #                   in: 0,
      #                   location: [16.17918, 61.799708],
      #                   out: 2
      #                 }
      #               ],
      #               maneuver: %{
      #                 bearing_after: 295,
      #                 bearing_before: 25,
      #                 location: [16.205359, 61.79423],
      #                 modifier: "left",
      #                 type: "turn"
      #               },
      #               mode: "driving",
      #               name: "Hybo Byväg",
      #               ref: "X 704",
      #               weight: 151.1
      #             },
      #             %{
      #               distance: 957.7,
      #               driving_side: "right",
      #               duration: 86.2,
      #               geometry: "okexJmmvaBgA`Hm@vDw@hD_@vA[lAUdASzAQbBg@bGk@zGe@dDiAdHkBhLu@jEUdAUz@m@zB]bA]v@c@|@",
      #               intersections: [
      #                 %{
      #                   bearings: [120, 300],
      #                   entry: [false, true],
      #                   in: 0,
      #                   location: [16.176389, 61.800398],
      #                   out: 1
      #                 }
      #               ],
      #               maneuver: %{
      #                 bearing_after: 296,
      #                 bearing_before: 296,
      #                 location: [16.176389, 61.800398],
      #                 modifier: "straight",
      #                 type: "new name"
      #               },
      #               mode: "driving",
      #               name: "Hybovägen",
      #               ref: "X 704",
      #               weight: 86.2
      #             },
      #             %{
      #               distance: 1581.1,
      #               driving_side: "right",
      #               duration: 142.2,
      #               geometry: "uefxJcksaB]n@s@bAc@h@i@d@cCdBo@j@c@j@c@p@gFxH_D|EiT|[kAbAcB~@cFxBwBdAg@^e@z@c@hA[`BeDfT",
      #               intersections: [
      #                 %{
      #                   bearings: [135, 330],
      #                   entry: [false, true],
      #                   in: 0,
      #                   location: [16.16066, 61.804587],
      #                   out: 1
      #                 },
      #                 %{
      #                   bearings: [75, 150, 330],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.156908, 61.807812],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [75, 165, 270, 345],
      #                   entry: [true, false, true, true],
      #                   in: 1,
      #                   location: [16.149903, 61.81404],
      #                   out: 3
      #                 }
      #               ],
      #               maneuver: %{
      #                 bearing_after: 322,
      #                 bearing_before: 319,
      #                 location: [16.16066, 61.804587],
      #                 modifier: "straight",
      #                 type: "new name"
      #               },
      #               mode: "driving",
      #               name: "Simanbo Hybovägen",
      #               ref: "X 704",
      #               weight: 142.2
      #             },
      #             %{
      #               distance: 2001,
      #               driving_side: "right",
      #               duration: 181,
      #               geometry: "cnhxJehpaBuAzIaDpS]jBgAlFsAlGGT[~AOj@YnAY~AUdBU`BUdCIv@I`AKhAIxAGfBCdBClBMlGCjAGpAObBUtAUjAS`AS~@a@bAiBxF]bA[lA[tAYpASlAMfAMnAKzAKxACj@GzAKhBOhBU`CSzAU|AYbB}A|GKr@OnAOlB]~Dc@rEWbCGz@Cl@@v@Fx@",
      #               intersections: [
      #                 %{
      #                   bearings: [120, 300],
      #                   entry: [false, true],
      #                   in: 0,
      #                   location: [16.144827, 61.816179],
      #                   out: 1
      #                 },
      #                 %{
      #                   bearings: [30, 120, 210, 300],
      #                   entry: [true, false, true, true],
      #                   in: 1,
      #                   location: [16.143086, 61.816606],
      #                   out: 3
      #                 },
      #                 %{
      #                   bearings: [120, 210, 300],
      #                   entry: [false, true, true],
      #                   in: 0,
      #                   location: [16.136132, 61.818533],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [15, 105, 285],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.133359, 61.819203],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [120, 195, 315],
      #                   entry: [false, true, true],
      #                   in: 0,
      #                   location: [16.126254, 61.820119],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [45, 135, 315],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.125907, 61.820287],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [15, 105, 285],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.121033, 61.82174],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [45, 120, 225, 300],
      #                   entry: [true, false, true, true],
      #                   in: 1,
      #                   location: [16.117209, 61.822393],
      #                   out: 3
      #                 },
      #                 %{
      #                   bearings: [15, 120, 300],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.115783, 61.822858],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [120, 195, 300],
      #                   entry: [false, true, true],
      #                   in: 0,
      #                   location: [16.115523, 61.822924],
      #                   out: 2
      #                 }
      #               ],
      #               maneuver: %{
      #                 bearing_after: 296,
      #                 bearing_before: 296,
      #                 location: [16.144827, 61.816179],
      #                 modifier: "straight",
      #                 type: "new name"
      #               },
      #               mode: "driving",
      #               name: "Hybovägen",
      #               ref: "X 704",
      #               weight: 181
      #             },
      #             %{
      #               distance: 77.8,
      #               driving_side: "right",
      #               duration: 12.2,
      #               geometry: "c|ixJmsiaBc@f@QPi@h@IHQT",
      #               intersections: [
      #                 %{
      #                   bearings: [75, 180, 330],
      #                   entry: [false, true, true],
      #                   in: 0,
      #                   location: [16.110792, 61.823535],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [150, 255, 330],
      #                   entry: [false, true, true],
      #                   in: 0,
      #                   location: [16.110592, 61.82372],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [15, 150, 330],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.110499, 61.823807],
      #                   out: 2
      #                 }
      #               ],
      #               maneuver: %{
      #                 bearing_after: 331,
      #                 bearing_before: 253,
      #                 location: [16.110792, 61.823535],
      #                 modifier: "right",
      #                 type: "end of road"
      #               },
      #               mode: "driving",
      #               name: "",
      #               ref: "X 704",
      #               weight: 12.2
      #             },
      #             %{
      #               distance: 1124.4,
      #               driving_side: "right",
      #               duration: 102,
      #               geometry: "_`jxJioiaBB~@@dBEfBC~@Cl@MjBUtBa@`CsAhH}@|Dm@`BsAzCITOn@Kj@Il@Gx@Ch@A`@G|AEz@APQpAO|@EVSjAe@rCi@vCQrAu@pEQ~@_AtFkAbIADc@rB?Bw@nCOb@",
      #               intersections: [
      #                 %{
      #                   bearings: [75, 150, 255, 345],
      #                   entry: [true, false, true, true],
      #                   in: 1,
      #                   location: [16.110131, 61.824161],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [45, 135, 315],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.102737, 61.825933],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [30, 105, 285],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.101271, 61.826244],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [30, 120, 300],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.098453, 61.826812],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [30, 120, 300],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.096219, 61.827376],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [30, 120, 300],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.094668, 61.827785],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [30, 120, 300],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.093017, 61.828177],
      #                   out: 2
      #                 }
      #               ],
      #               maneuver: %{
      #                 bearing_after: 260,
      #                 bearing_before: 333,
      #                 location: [16.110131, 61.824161],
      #                 modifier: "left",
      #                 type: "turn"
      #               },
      #               mode: "driving",
      #               name: "Norra Järnvägsgatan",
      #               ref: "84",
      #               weight: 102
      #             },
      #             %{
      #               distance: 566.6,
      #               driving_side: "right",
      #               duration: 53.2,
      #               geometry: "o|jxJ_{eaBGEG?EFEHAN?NBLBJIPs@lDOp@QbAUhA]pBm@|DMhAGl@Ex@Ex@C|@?dABfADfAHv@FdARjBLvALjAJ|@RbAd@bB",
      #               intersections: [
      #                 %{
      #                   bearings: [15, 135, 225],
      #                   entry: [true, false, false],
      #                   in: 1,
      #                   location: [16.091518, 61.828722],
      #                   out: 0
      #                 },
      #                 %{
      #                   bearings: [30, 135, 285],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.091455, 61.828857],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [45, 195, 300],
      #                   entry: [false, true, true],
      #                   in: 0,
      #                   location: [16.091169, 61.828827],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [30, 120, 300],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.090209, 61.829141],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [30, 120, 300],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.089249, 61.829423],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [15, 105, 285],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.08736, 61.829865],
      #                   out: 2
      #                 }
      #               ],
      #               maneuver: %{
      #                 bearing_after: 21,
      #                 bearing_before: 309,
      #                 exit: 2,
      #                 location: [16.091518, 61.828722],
      #                 modifier: "straight",
      #                 type: "roundabout turn"
      #               },
      #               mode: "driving",
      #               name: "Norra Järnvägsgatan",
      #               ref: "84",
      #               weight: 53.2
      #             },
      #             %{
      #               distance: 53.9,
      #               driving_side: "right",
      #               duration: 7.2,
      #               geometry: "{_kxJu_daBERAT@TDRFLHBHAHKDQ",
      #               intersections: [
      #                 %{
      #                   bearings: [45, 150, 300],
      #                   entry: [false, false, true],
      #                   in: 0,
      #                   location: [16.082025, 61.829255],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [60, 210, 315],
      #                   entry: [false, true, true],
      #                   in: 0,
      #                   location: [16.081612, 61.829264],
      #                   out: 1
      #                 }
      #               ],
      #               maneuver: %{
      #                 bearing_after: 303,
      #                 bearing_before: 230,
      #                 exit: 2,
      #                 location: [16.082025, 61.829255],
      #                 modifier: "right",
      #                 type: "roundabout"
      #               },
      #               mode: "driving",
      #               name: "Kyrkogatan",
      #               ref: "84",
      #               weight: 7.2
      #             },
      #             %{
      #               distance: 457.9,
      #               driving_side: "right",
      #               duration: 41.5,
      #               geometry: "o~jxJo}caBj@hAHNb@x@bAhBb@hATpALzB?rCIzCYhHg@lIAh@",
      #               intersections: [
      #                 %{
      #                   bearings: [105, 225, 300],
      #                   entry: [true, true, false],
      #                   in: 2,
      #                   location: [16.081683, 61.829037],
      #                   out: 1
      #                 },
      #                 %{
      #                   bearings: [0, 90, 285],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.078273, 61.827892],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [105, 195, 285],
      #                   entry: [false, true, true],
      #                   in: 0,
      #                   location: [16.077486, 61.827941],
      #                   out: 2
      #                 }
      #               ],
      #               maneuver: %{
      #                 bearing_after: 219,
      #                 bearing_before: 123,
      #                 exit: 2,
      #                 location: [16.081683, 61.829037],
      #                 modifier: "right",
      #                 type: "exit roundabout"
      #               },
      #               mode: "driving",
      #               name: "Kyrkogatan",
      #               ref: "84",
      #               weight: 41.5
      #             },
      #             %{
      #               distance: 404.1,
      #               driving_side: "right",
      #               duration: 36.5,
      #               geometry: "wyjxJgnbaBUZUZQ`@QX]xBMv@Q`AMd@Q^[^wJpK",
      #               intersections: [
      #                 %{
      #                   bearings: [90, 225, 330],
      #                   entry: [false, true, true],
      #                   in: 0,
      #                   location: [16.074116, 61.828277],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [30, 150, 300],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.073535, 61.828676],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [60, 135, 255, 330],
      #                   entry: [true, false, true, true],
      #                   in: 1,
      #                   location: [16.071973, 61.829145],
      #                   out: 3
      #                 }
      #               ],
      #               maneuver: %{
      #                 bearing_after: 329,
      #                 bearing_before: 272,
      #                 location: [16.074116, 61.828277],
      #                 modifier: "right",
      #                 type: "continue"
      #               },
      #               mode: "driving",
      #               name: "Kyrkogatan",
      #               ref: "83",
      #               weight: 36.5
      #             },
      #             %{
      #               distance: 2769.5,
      #               driving_side: "right",
      #               duration: 192,
      #               geometry: "ykkxJgsaaBg@`@eBlAuAl@g@TcBr@q@\\kB~AiAjAy@x@o@r@i@v@k@fAc@~@c@nA}@fD}@bDcAzDg@pBi@pBk@pBIl@G^OnAOnBKjBc@jIi@pIK`BSrD[pEw@`HG^k@tEMfAa@~DYpDI`BGjAKjCExC?rCFjEF|CNpCFlA~@tIRrAnD|URvAfEnYpC`RdAhHF^ThBLt@",
      #               intersections: [
      #                 %{
      #                   bearings: [150, 345],
      #                   entry: [false, true],
      #                   in: 0,
      #                   location: [16.0698, 61.831166],
      #                   out: 1
      #                 },
      #                 %{
      #                   bearings: [60, 165, 330],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.068486, 61.833264],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [30, 135, 315],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.065722, 61.835485],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [30, 120, 315],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.06198, 61.83686],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [15, 105, 285],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.057863, 61.837567],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [15, 105, 285],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.055682, 61.837838],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [105, 240, 300],
      #                   entry: [false, true, true],
      #                   in: 0,
      #                   location: [16.052275, 61.838361],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [30, 120, 300],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.052122, 61.838399],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [15, 120, 300],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.051053, 61.838616],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [105, 210, 285],
      #                   entry: [false, true, true],
      #                   in: 0,
      #                   location: [16.048351],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [75, 180, 255],
      #                   entry: [false, true],
      #                   in: 0,
      #                   location: []
      #                 },
      #                 %{bearings: [75, 240], entry: [false], in: 0},
      #                 %{bearings: [60], entry: []},
      #                 %{bearings: []}

      #               ],
      #               maneuver: %{
      #                 bearing_after: 337,
      #                 bearing_before: 331,
      #                 location: [16.0698, 61.831166],
      #                 modifier: "straight",
      #                 type: "new name"
      #               },
      #               mode: "driving",
      #               name: "Ramsjövägen",
      #               ref: "83",
      #               weight: 192
      #             },
      #             %{
      #               distance: 2881,
      #               driving_side: "right",
      #               duration: 216.5,
      #               geometry: "melxJyfy`Bf@fDRpBN`BVlC@b@RvDFlBFrB@vABlBApBA|AClBIdDIfBIvBQ`C_@jE[bCw@pFk@|DgChQ]|Bu@bFQ|AIl@e@xDi@xEQbBCPOdAOx@a@|Ao@lB]l@a@p@cB|Au@d@o@V{@\\cAPs@F[@S@m@Am@Ec@EkBa@i@IeCo@sBw@UG_@Gy@CS@]DWDWH}Bz@iBz@]XOPQRINS\\Sd@kB~Dc@|@QVW\\e@d@_@b@k@j@i@l@UZYh@]r@Qh@cApBk@fAwA|ByArBs@t@y@p@OJgBrA",
      #               intersections: [
      #                 %{
      #                   bearings: [60, 240],
      #                   entry: [false, true],
      #                   in: 0,
      #                   location: [16.026851, 61.83527],
      #                   out: 1
      #                 },
      #                 %{
      #                   bearings: [75, 255, 345],
      #                   entry: [false, true, true],
      #                   in: 0,
      #                   location: [16.02406, 61.834759],
      #                   out: 1
      #                 },
      #                 %{
      #                   bearings: [90, 195, 270],
      #                   entry: [false, true, true],
      #                   in: 0,
      #                   location: [16.019429, 61.834589],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [30, 120, 300],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [16.007587, 61.836867],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [120, 210, 300],
      #                   entry: [false, true, true],
      #                   in: 0,
      #                   location: [16.006658, 61.837057],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [120, 195, 300],
      #                   entry: [false, true, true],
      #                   in: 0,
      #                   location: [16.004628, 61.837464],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [120, 195, 300],
      #                   entry: [false, true, true],
      #                   in: 0,
      #                   location: [16.004342, 61.837538],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [60, 150, 330],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [15.999673, 61.846772],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [135, 240, 315],
      #                   entry: [false, true, true],
      #                   in: 0,
      #                   location: [15.998034],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [165, 225, 345],
      #                   entry: [false, true],
      #                   in: 0,
      #                   location: []
      #                 }
      #               ],
      #               maneuver: %{
      #                 bearing_after: 243,
      #                 bearing_before: 241,
      #                 location: [16.026851, 61.83527],
      #                 modifier: "straight",
      #                 type: "new name"
      #               },
      #               mode: "driving",
      #               name: "Heden Ramsjövägen",
      #               ref: "83",
      #               weight: 216.5
      #             },
      #             %{
      #               distance: 2184,
      #               driving_side: "right",
      #               duration: 123,
      #               geometry: "meoxJa_s`BqBxA{EfCwCxB_A|@g@b@a@f@qAlAoA`AqAx@eCpAmCpCsHbJmFpGgApAk@r@_AnAcBrCgAlB[f@c@j@[Vm@d@}@l@c@N_Ab@wAb@s@LsBPE?gAFu@F{AJaBTy@Rs@\\a@Zk@f@e@h@]\\a@X[Na@Li@JmBTuCZqAP",
      #               intersections: [
      #                 %{
      #                   bearings: [165, 345],
      #                   entry: [false, true],
      #                   in: 0,
      #                   location: [15.994885, 61.850626],
      #                   out: 1
      #                 },
      #                 %{
      #                   bearings: [75, 165, 345],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [15.994435, 61.851198],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [105, 150, 240, 330],
      #                   entry: [true, false, true, true],
      #                   in: 1,
      #                   location: [15.992659, 61.853578],
      #                   out: 3
      #                 },
      #                 %{
      #                   bearings: [30, 165, 330],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [15.991035, 61.855636],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [60, 150, 330],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [15.988529, 61.857885],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [150, 240, 330],
      #                   entry: [false, true, true],
      #                   in: 0,
      #                   location: [15.987164, 61.85908],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [0, 75, 180],
      #                   entry: [true, true, false],
      #                   in: 2,
      #                   location: [15.983203, 61.864006],
      #                   out: 0
      #                 },
      #                 %{
      #                   bearings: [0, 15, 180],
      #                   entry: [true, true, false],
      #                   in: 2,
      #                   location: [15.981445],
      #                   out: 0
      #                 }
      #               ],
      #               maneuver: %{
      #                 bearing_after: 338,
      #                 bearing_before: 338,
      #                 location: [15.994885, 61.850626],
      #                 modifier: "straight",
      #                 type: "new name"
      #               },
      #               mode: "driving",
      #               name: "Pållamon Ramsjövägen",
      #               ref: "83",
      #               weight: 123
      #             },
      #             %{
      #               distance: 7278.1,
      #               driving_side: "right",
      #               duration: 450.8,
      #               geometry: "uwrxJojp`BUBUFiAb@g@Zm@f@}@x@iDnDi@j@m@z@m@dAiAtBy@bBuApD?@o@~B[hBSfBMnAEr@Et@GvAWbMCx@[dOCnA?|AA~@@jAD|AT`ID|C@bDAlAC~@Ez@MvAWjBY|Ae@dB_ApCm@~AgJ~VwC~H]~@WbA]pA]jBc@zCQlAYnBo@nCcBfGyAbFwB|G[dAsh@~bB_@jAoA~DqDpLuA|Eq@pCk@|Cm@~Ck@rEa@lD]`FEx@iA|YaAtRSjBQzAc@~Be@pBe@lA_@j@e@j@k@\\o@XwHp@kBTSDc@L_@Jg@Vc@d@a@f@]p@]t@_@jAe@lBu@jC[xASv@mAnEk@dBaAxB_BpC{@nAaAfAq@v@uLdLA@MJIHiSrRaC|BgBbBgAhAu@|@s@lAy@~AiC|F{@pBoEzJOZQ^g@`Ac@t@_AnASTeCfCs@l@",
      #               intersections: [
      #                 %{
      #                   bearings: [0, 180],
      #                   entry: [true, false],
      #                   in: 1,
      #                   location: [15.981359, 61.868905],
      #                   out: 0
      #                 },
      #                 %{
      #                   bearings: [135, 150, 330],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [15.979385, 61.871295],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [30, 90, 210, 270],
      #                   entry: [true, false, true, true],
      #                   in: 1,
      #                   location: [15.97143, 61.873621],
      #                   out: 3
      #                 },
      #                 %{
      #                   bearings: [75, 180, 345],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [15.907935, 61.894366],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [165, 255, 345],
      #                   entry: [false, true, true],
      #                   in: 0,
      #                   location: [15.907841, 61.894654],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [45, 120, 315],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [15.905819, 61.89601],
      #                   out: 2
      #                 },
      #                 %{
      #                   bearings: [45, 120, 225, 315],
      #                   entry: [true, false, true],
      #                   in: 1,
      #                   location: [15.904668],
      #                   out: 3
      #                 },
      #                 %{
      #                   bearings: [135, 255, 315],
      #                   entry: [false, true],
      #                   in: 0,
      #                   location: []
      #                 },
      #                 %{bearings: [45, 135], entry: [true], in: 1},
      #                 %{bearings: [60], entry: []},
      #                 %{bearings: []}
      #               ],
      #               maneuver: %{
      #                 bearing_after: 354,
      #                 bearing_before: 352,
      #                 location: [15.981359, 61.868905],
      #                 modifier: "straight",
      #                 type: "new name"
      #               },
      #               mode: "driving",
      #               name: "Skogsta Ramsjövägen",
      #               ref: "83",
      #               weight: 450.8
      #             },
      #             %{
      #               distance: 2465.2,
      #               driving_side: "right",
      #               duration: 354.8,
      #               geometry: "u|zxJux}_BTnB^pCPvCF|A?pCEbBIpBQhBIn@Gb@Kr@o@xDq@rEShBMt@Ol@]fAc@fBi@zCQtASvBW|CGzACjECpAIvAGv@g@lDUnCGnAQ~CMnCGxAIlJAbFCvBGvBYfCmBbL_B|H}BbOkBlIuA`EeE`IcAlB_@hBQ|CChKEzDEjEK|HWvE",
      #               intersections: [
      #                 %{
      #                   bearings: [150, 255, 330],
      #                   entry: [false, true, true],
      #                   in: 0,
      #                   location: [15.886348, 61.910666],
      #                   out: 1
      #                 },
      #                 %{
      #                   bearings: [105, 270, 315],
      #                   entry: [false, true, true],
      #                   in: 0,
      #                   location: [15.850514, 61.91736],
      #                   out: 1
      #                 }
      #               ],
      #               maneuver: %{
      #                 bearing_after: 247,
      #                 bearing_before: 336,
      #                 location: [15.886348, 61.910666],
      #                 modifier: "left",
      #                 type: "turn"
      #               },
      #               mode: "driving",
      #               name: "Störsbäcksvägen",
      #               weight: 354.8
      #             },
      #             %{
      #               distance: 208.8,
      #               driving_side: "right",
      #               duration: 50.1,
      #               geometry: "ch|xJmou_B]z@_@v@[b@Wv@c@rA[bA_Ap@[d@Ml@",
      #               intersections: [
      #                 %{
      #                   bearings: [105, 285, 315],
      #                   entry: [false, true, true],
      #                   in: 0,
      #                   location: [15.843911, 61.917615],
      #                   out: 2
      #                 }
      #               ],
      #               maneuver: %{
      #                 bearing_after: 316,
      #                 bearing_before: 282,
      #                 location: [15.843911, 61.917615],
      #                 modifier: "slight right",
      #                 type: "turn"
      #               },
      #               mode: "driving",
      #               name: "",
      #               weight: 100.3
      #             },
      #             %{
      #               distance: 0,
      #               driving_side: "right",
      #               duration: 0,
      #               geometry: "_q|xJ_`u_B",
      #               intersections: [
      #                 %{
      #                   bearings: '}',
      #                   entry: [true],
      #                   in: 0,
      #                   location: [15.841443, 61.919044]
      #                 }
      #               ],
      #               maneuver: %{
      #                 bearing_after: 0,
      #                 bearing_before: 305,
      #                 location: [15.841443, 61.919044],
      #                 type: "arrive"
      #               },
      #               mode: "driving",
      #               name: "",
      #               weight: 0
      #             }
      #           ],
      #           summary: "Hybovägen, Störsbäcksvägen",
      #           weight: 2319.5
      #         }
      #       ],
      #       started: ~N[2020-04-07 07:00:52.809246],
      #       weight: 2319.5,
      #       weight_name: "routability"
      #     }
      #   }
      # ]
    candidates =
      Engine.App.find_candidates(latest_bookings, latest_cars)
      |> (fn %{assignments: assignments} -> assignments end).()
      |> Enum.filter(fn %{booking: booking, car: car} -> Dispatch.evaluate(booking, car) end)
      |> Enum.map(fn %{booking: booking, car: car} ->
        # Car.offer(car, booking)
        %{booking: booking, car: car, accepted: true}
      end)
      |> Enum.filter(fn %{accepted: accepted} -> accepted end)

    # |> Enum.map(fn %{booking: booking, car: car} -> Booking.assign(car, booking) end)
    # |> Enum.map(fn %{booking: booking, car: car} ->
    #   MQ.publish(car, "assignedCars")
    #   MQ.publish(booking, "assignedBookings")
    # end)
    # |> IO.inspect(label: "data")

    assert length(latest_bookings) == 5
    assert length(latest_cars) == 5
  end
end
