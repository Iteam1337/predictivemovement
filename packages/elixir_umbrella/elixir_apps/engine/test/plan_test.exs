defmodule PlanTest do
  import TestHelper
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
            "1EspgNhLKYAAAAAAAgAAACEAAAApAAAAAAAAAIk3aUBgTEVCf_t_QgAAAAACAAAAIQAAACkAAACIAQAAEKf0AMicrwMQp_QAyJyvAwYAXw5StUSx",
          lat: 61.840584,
          lon: 16.033552
        },
        id: "pmv-5MNjCOZb",
        latest_end: nil,
        metadata: %{},
        profile: nil,
        start_address: %{
          hint:
            "1EspgNhLKYAAAAAAAgAAACEAAAApAAAAAAAAAIk3aUBgTEVCf_t_QgAAAAACAAAAIQAAACkAAACIAQAAEKf0AMicrwMQp_QAyJyvAwYAXw5StUSx",
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
            "VxkngKr5AoAQAAAAXAAAAHoDAABKBAAAbyS0QN0QAELmM5tDYBm_QwgAAAAuAAAAwAEAACUCAACIAQAAUZrzALx2rgNRmvMAvHauAxMATwdStUSx",
          lat: 61.765308,
          lon: 15.964753
        },
        id: "pmv-3EDtbNnn",
        latest_end: nil,
        metadata: %{},
        profile: nil,
        start_address: %{
          hint:
            "VxkngKr5AoAQAAAAXAAAAHoDAABKBAAAbyS0QN0QAELmM5tDYBm_QwgAAAAuAAAAwAEAACUCAACIAQAAUZrzALx2rgNRmvMAvHauAxMATwdStUSx",
          lat: 61.765308,
          lon: 15.964753
        }
      }
    ]

    assert Plan.insert_time_matrix(TimeMatrixMock.get_vehicles_and_bookings())
           |> Map.get(:vehicles) == expected_vehicles
  end
end
