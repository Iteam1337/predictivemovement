defmodule VehicleTest do
  import TestHelper
  use ExUnit.Case

  test "it allows vehicle creation" do
    MessageGenerator.random_car()
    |> Vehicle.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()
    clear_state()
    assert vehicle_ids |> length() == 1
  end

  test "required start address" do
    %{
      id: 87147
    }
    |> Vehicle.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()

    clear_state()
    assert vehicle_ids |> length() == 0
  end

  test "does not allow malformed time constraints" do
    errors =
      MessageGenerator.random_car(%{earliest_start: "foo", latest_end: "bar"})
      |> Vehicle.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()

    clear_state()
    assert vehicle_ids |> length() == 0
  end

  test "does not allow non integer weight capacity" do
    errors =
      MessageGenerator.random_car(%{
        capacity: %{volume: 2, weight: 13.4}
      })
      |> Vehicle.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()

    clear_state()
    assert vehicle_ids |> length() == 0
    assert errors == [{:error, [:capacity, :weight], :by, "must be an integer"}]
  end

  test "does not allow non integer volume capacity" do
    MessageGenerator.random_car(%{earliest_start: "foo", latest_end: "bar"})
    |> Vehicle.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()

    clear_state()
    assert vehicle_ids |> length() == 0
  end
end
