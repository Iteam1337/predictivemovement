defmodule PlanTest do
  use ExUnit.Case

  test "maps vehicles and bookings to coordinates without duplicates " do
    items = %{
      vehicles: [
        %{
          start_address: %{
            lon: 16.033552,
            lat: 61.840584
          },
          end_address: %{
            lon: 16.033552,
            lat: 62.840584
          }
        }
      ],
      bookings: [
        %{
          pickup: %{
            lon: 16.143637,
            lat: 61.906519
          },
          delivery: %{
            lon: 16.044623,
            lat: 61.831175
          }
        }
      ]
    }

    assert(
      Plan.map_vehicles_and_bookings_to_coordinates(items) == [
        %{lat: 61.906519, lon: 16.143637},
        %{lat: 61.831175, lon: 16.044623},
        %{lat: 61.840584, lon: 16.033552},
        %{lat: 62.840584, lon: 16.033552}
      ]
    )
  end

  test "maps vehicles and bookings to coordinates with duplicates" do
    items = %{
      vehicles: [
        %{
          start_address: %{
            lon: 16.033552,
            lat: 61.840584
          },
          end_address: %{
            lon: 16.033552,
            lat: 61.840584
          }
        }
      ],
      bookings: [
        %{
          pickup: %{
            lon: 16.143637,
            lat: 61.906519
          },
          delivery: %{
            lon: 16.044623,
            lat: 61.831175
          }
        }
      ]
    }

    assert(
      Plan.map_vehicles_and_bookings_to_coordinates(items) == [
        %{lat: 61.906519, lon: 16.143637},
        %{lat: 61.831175, lon: 16.044623},
        %{lat: 61.840584, lon: 16.033552},
        %{lat: 61.840584, lon: 16.033552}
      ]
    )
  end

  test "adds hints from matrix correctly " do
    map = %{
      bookings: [
        %{
          assigned_to: nil,
          delivery: %{lat: 61.831175, lon: 16.044623},
          events: [%{timestamp: "2020-09-14T13:38:21.094059Z", type: "new"}],
          external_id: 85148,
          id: "pmb-1FECmfgs",
          metadata: %{
            recipient: %{contact: "0701234567"},
            sender: %{contact: "0701234567"}
          },
          pickup: %{lat: 61.906519, lon: 16.143637}
        }
      ],
      matrix: %{
        "sources" => [
          %{
            "distance" => 0,
            "hint" =>
              "rbIggM2yIIAXAAAAAAAAAKYBAADsCQAA7CzQQQAAAAAaZetDtqgwRRcAAAAAAAAApgEAAOwJAAB6AQAAFVX2AFeesAMVVfYAV56wAwQAbwrxFKHF",
            "location" => [16.143637, 61.906519],
            "name" => ""
          },
          %{
            "distance" => 0,
            "hint" =>
              "JacggCinIIAMAAAADgAAAHsBAABtAAAAPlKoQGx8r0B7rB5Dk7M2QgwAAAAOAAAAewEAAG0AAAB6AQAAT9L0AAd4rwNP0vQAB3ivAwQALwXxFKHF",
            "location" => [16.044623, 61.831175],
            "name" => ""
          },
          %{
            "distance" => 0,
            "hint" =>
              "WLwggFy8IIAAAAAAAgAAACEAAAApAAAAAAAAAIk3aUBgTEVCf_t_QgAAAAACAAAAIQAAACkAAAB6AQAAEKf0AMicrwMQp_QAyJyvAwYAXw7xFKHF",
            "location" => [16.033552, 61.840584],
            "name" => "Sidnäsvägen"
          },
          %{
            "distance" => 0,
            "hint" =>
              "WLwggFy8IIAAAAAAAgAAACEAAAApAAAAAAAAAIk3aUBgTEVCf_t_QgAAAAACAAAAIQAAACkAAAB6AQAAEKf0AMicrwMQp_QAyJyvAwYAXw7xFKHF",
            "location" => [16.033552, 61.840584],
            "name" => "Sidnäsvägen"
          }
        ]
      },
      vehicles: [
        %{
          activities: nil,
          booking_ids: nil,
          busy: nil,
          capacity: %{volume: 18, weight: 50},
          current_route: nil,
          earliest_start: nil,
          end_address: %{lat: 61.840584, lon: 16.033552},
          id: "pmv-5MNjCOZb",
          latest_end: nil,
          metadata: %{},
          profile: nil,
          start_address: %{lat: 61.840584, lon: 16.033552}
        }
      ]
    }

    res = Plan.add_hints_from_matrix(map)

    booking_hints =
      res
      |> Map.get(:bookings)
      |> Enum.flat_map(fn %{pickup: p, delivery: d} -> [p.hint, d.hint] end)

    vehicle_hints =
      res
      |> Map.get(:vehicles)
      |> Enum.flat_map(fn %{start_address: sa, end_address: ea} -> [sa.hint, ea.hint] end)

    assert Enum.concat(booking_hints, vehicle_hints) == [
             "rbIggM2yIIAXAAAAAAAAAKYBAADsCQAA7CzQQQAAAAAaZetDtqgwRRcAAAAAAAAApgEAAOwJAAB6AQAAFVX2AFeesAMVVfYAV56wAwQAbwrxFKHF",
             "JacggCinIIAMAAAADgAAAHsBAABtAAAAPlKoQGx8r0B7rB5Dk7M2QgwAAAAOAAAAewEAAG0AAAB6AQAAT9L0AAd4rwNP0vQAB3ivAwQALwXxFKHF",
             "WLwggFy8IIAAAAAAAgAAACEAAAApAAAAAAAAAIk3aUBgTEVCf_t_QgAAAAACAAAAIQAAACkAAAB6AQAAEKf0AMicrwMQp_QAyJyvAwYAXw7xFKHF",
             "WLwggFy8IIAAAAAAAgAAACEAAAApAAAAAAAAAIk3aUBgTEVCf_t_QgAAAAACAAAAIQAAACkAAAB6AQAAEKf0AMicrwMQp_QAyJyvAwYAXw7xFKHF"
           ]
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
