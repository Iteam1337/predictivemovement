defmodule PlanTest do
  use ExUnit.Case

  @vehicles [
    %{
      id: "pmv-1",
      start_address: %{
        lat: 1,
        lon: 1,
        foo: "bar"
      },
      end_address: %{
        lat: 2,
        lon: 2,
        herp: "derp"
      }
    },
    %{
      id: "pmv-2",
      start_address: %{
        lat: 1,
        lon: 1,
        foo: "bar"
      },
      end_address: %{
        lat: 1,
        lon: 1,
        herp: "derp"
      }
    },
    %{
      id: "pmv-3",
      start_address: %{
        lat: 1,
        lon: 1
      },
      end_address: %{
        lat: 2,
        lon: 2
      }
    },
    %{
      id: "pmv-4",
      start_address: %{
        lat: 1,
        lon: 1
      },
      end_address: %{
        lat: 1,
        lon: 1
      }
    }
  ]
  @hints [
    "hint_start_pmv-1",
    "hint_end_pmv-1",
    "hint_start_pmv-2",
    "hint_start_pmv-3",
    "hint_end_pmv-3",
    "hint_start_pmv-4"
  ]

  test "adds vehicle hints correctly" do
    actual_result = Plan.add_vehicle_hints(@vehicles, @hints)

    expected_result = [
      %{
        id: "pmv-1",
        start_address: %{
          lat: 1,
          lon: 1,
          hint: "hint_start_pmv-1",
          foo: "bar"
        },
        end_address: %{
          lat: 2,
          lon: 2,
          hint: "hint_end_pmv-1",
          herp: "derp"
        }
      },
      %{
        id: "pmv-2",
        start_address: %{
          lat: 1,
          lon: 1,
          hint: "hint_start_pmv-2",
          foo: "bar"
        },
        end_address: %{
          lat: 1,
          lon: 1,
          hint: "hint_start_pmv-2",
          herp: "derp"
        }
      },
      %{
        id: "pmv-3",
        start_address: %{
          lat: 1,
          lon: 1,
          hint: "hint_start_pmv-3"
        },
        end_address: %{
          lat: 2,
          lon: 2,
          hint: "hint_end_pmv-3"
        }
      },
      %{
        id: "pmv-4",
        start_address: %{
          lat: 1,
          lon: 1,
          hint: "hint_start_pmv-4"
        },
        end_address: %{
          lat: 1,
          lon: 1,
          hint: "hint_start_pmv-4"
        }
      }
    ]

    assert actual_result === expected_result
  end
end
