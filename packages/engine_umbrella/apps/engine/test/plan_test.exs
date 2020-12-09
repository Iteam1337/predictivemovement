defmodule PlanTest do
  use ExUnit.Case
  alias MessageGenerator.BookingGenerator

  test "insert time matrix correctly" do
    expected_vehicles = [
      %{
        activities: nil,
        booking_ids: nil,
        busy: nil,
        capacity: %{volume: 18, weight: 50},
        current_route: nil,
        earliest_start: nil,
        end_address: %{
          hint:
            "XHsqgGB7KoAAAAAAAgAAACEAAAApAAAAAAAAAIk3aUBgTEVCf_t_QgAAAAACAAAAIQAAACkAAACCAQAAEKf0AMicrwMQp_QAyJyvAwYAXw7sYsCD",
          lat: 61.840584,
          lon: 16.033552
        },
        id: "pmv-5MNjCOZb",
        latest_end: nil,
        metadata: %{},
        profile: nil,
        start_address: %{
          hint:
            "XHsqgGB7KoAAAAAAAgAAACEAAAApAAAAAAAAAIk3aUBgTEVCf_t_QgAAAAACAAAAIQAAACkAAACCAQAAEKf0AMicrwMQp_QAyJyvAwYAXw7sYsCD",
          lat: 61.840584,
          lon: 16.033552
        }
      },
      %{
        activities: nil,
        booking_ids: nil,
        busy: nil,
        capacity: %{volume: 15, weight: 700},
        current_route: nil,
        earliest_start: nil,
        end_address: %{
          hint:
            "zvUngIoJA4AQAAAAXAAAAHoDAABKBAAAbyS0QN0QAELmM5tDYBm_QwgAAAAuAAAAwAEAACUCAACCAQAAUZrzALx2rgNRmvMAvHauAxMATwfsYsCD",
          lat: 61.765308,
          lon: 15.964753
        },
        id: "pmv-3EDtbNnn",
        latest_end: nil,
        metadata: %{},
        profile: nil,
        start_address: %{
          hint:
            "zvUngIoJA4AQAAAAXAAAAHoDAABKBAAAbyS0QN0QAELmM5tDYBm_QwgAAAAuAAAAwAEAACUCAACCAQAAUZrzALx2rgNRmvMAvHauAxMATwfsYsCD",
          lat: 61.765308,
          lon: 15.964753
        }
      }
    ]

    assert Plan.insert_time_matrix(TimeMatrixMock.get_vehicles_and_bookings())
           |> Map.get(:vehicles) == expected_vehicles
  end

  test "adds distance and time on vehicle activites" do
    vehicle =
      %{
        activities: [
          %{address: %{lat: 61.833656311035156, lon: 15.978939056396484}},
          %{address: %{lat: 61.87600326538086, lon: 15.957921028137207}},
          %{address: %{lat: 61.85926055908203, lon: 16.17622184753418}}
        ],
        current_route: %{
          legs: [
            %{"distance" => 23585.6, "duration" => 1858},
            %{"distance" => 3302.1, "duration" => 285.1},
            %{"distance" => 22236.6, "duration" => 1540.1}
          ]
        }
      }
      |> Map.update!(:current_route, &Jason.encode!/1)

    res =
      vehicle
      |> Plan.add_distance_durations()
      |> Map.get(:activities)
      |> Enum.map(fn activity -> Map.take(activity, [:distance, :duration]) end)

    assert res == [
             %{distance: 0, duration: 0},
             %{distance: 23585.6, duration: 1858},
             %{distance: 3302.1, duration: 285.1},
             %{distance: 22236.6, duration: 1540.1}
           ]
  end

  test "adds addresses" do
    booking_id =
      BookingGenerator.generate_booking_props(%{
        pickup: %{
          name: "storgatan 8",
          street: "storgatan 8",
          city: "Stockholm",
          lat: 1,
          lon: 2
        },
        delivery: %{
          name: "östermalmsgatan 8",
          street: "östermalmsgatan 8",
          city: "Stockholm",
          lat: 13,
          lon: 23
        }
      })
      |> Booking.make()

    vehicle = %{
      start_address: %{
        city: "Stockholm",
        lat: 59.336126,
        lon: 18.014475,
        name: "Kellgrensgatan 14, Stockholm",
        street: "Kellgrensgatan 14"
      },
      end_address: %{
        city: "Stockholm",
        lat: 59.336126,
        lon: 18.014475,
        name: "Kellgrensgatan 14, Stockholm",
        street: "Kellgrensgatan 14"
      },
      booking_ids: ["pmb-nta0ywni"],
      activities: [
        %{type: "start", address: %{lat: 61.833656311035156, lon: 15.978939056396484}},
        %{
          id: booking_id,
          type: "pickupShipment",
          address: %{lat: 61.87600326538086, lon: 15.957921028137207}
        },
        %{
          id: booking_id,
          type: "deliverShipment",
          address: %{lat: 61.85926055908203, lon: 16.17622184753418}
        }
      ]
    }

    addresses =
      vehicle
      |> Plan.add_address_info()
      |> Map.get(:activities)
      |> Enum.map(fn activity ->
        Map.get(activity, :address) |> Map.take([:city, :name, :street])
      end)

    assert addresses == [
             %{
               name: "Kellgrensgatan 14, Stockholm",
               city: "Stockholm",
               street: "Kellgrensgatan 14"
             },
             %{
               city: "Stockholm",
               name: "storgatan 8",
               street: "storgatan 8"
             },
             %{
               city: "Stockholm",
               name: "östermalmsgatan 8",
               street: "östermalmsgatan 8"
             }
           ]
  end
end
