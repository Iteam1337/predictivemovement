defmodule PlanTest do
  use ExUnit.Case

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
            "WcYngF3GJ4AAAAAAAgAAACEAAAApAAAAAAAAAIk3aUBgTEVCf_t_QgAAAAACAAAAIQAAACkAAAB7AQAAEKf0AMicrwMQp_QAyJyvAwYAXw5fKDfv",
          lat: 61.840584,
          lon: 16.033552
        },
        id: "pmv-5MNjCOZb",
        latest_end: nil,
        metadata: %{},
        profile: nil,
        start_address: %{
          hint:
            "WcYngF3GJ4AAAAAAAgAAACEAAAApAAAAAAAAAIk3aUBgTEVCf_t_QgAAAAACAAAAIQAAACkAAAB7AQAAEKf0AMicrwMQp_QAyJyvAwYAXw5fKDfv",
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
            "n68ngET-AoAQAAAAXAAAAHoDAABKBAAAbyS0QN0QAELmM5tDYBm_QwgAAAAuAAAAwAEAACUCAAB7AQAAUZrzALx2rgNRmvMAvHauAxMATwdfKDfv",
          lat: 61.765308,
          lon: 15.964753
        },
        id: "pmv-3EDtbNnn",
        latest_end: nil,
        metadata: %{},
        profile: nil,
        start_address: %{
          hint:
            "n68ngET-AoAQAAAAXAAAAHoDAABKBAAAbyS0QN0QAELmM5tDYBm_QwgAAAAuAAAAwAEAACUCAAB7AQAAUZrzALx2rgNRmvMAvHauAxMATwdfKDfv",
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
          %{address: %{lat: 61.85926055908203, lon: 16.17622184753418}},
          %{address: %{lat: 61.2131314, lon: 16.1231314}}
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
end
