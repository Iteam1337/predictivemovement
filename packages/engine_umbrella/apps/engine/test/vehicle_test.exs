defmodule VehicleTest do
  import TestHelper
  use ExUnit.Case

  test "it allows vehicle creation" do
    result =
      MessageGenerator.random_car()
      |> Vehicle.make()

    assert is_binary(result)
    clear_state()
  end

  test "required start address" do
    result =
      %{
        id: 87147
      }
      |> Vehicle.make()

    assert result == [{:error, :start_address, :presence, "must be present"}]
  end

  test "does not allow malformed time constraints" do
    result =
      MessageGenerator.random_car(%{earliest_start: "foo", latest_end: "bar"})
      |> Vehicle.make()

    assert result == [
             {
               :error,
               :earliest_start,
               :format,
               "must have the correct format"
             },
             {:error, :latest_end, :format, "must have the correct format"}
           ]
  end

  test "does not allow non integer weight capacity" do
    result =
      MessageGenerator.random_car(%{
        capacity: %{volume: 2, weight: 13.4}
      })
      |> Vehicle.make()

    assert result == [{:error, [:capacity, :weight], :by, "must be an integer"}]
  end

  test "does not allow non integer volume capacity" do
    result =
      MessageGenerator.random_car(%{earliest_start: "foo", latest_end: "bar"})
      |> Vehicle.make()

    assert result == [
             {:error, :earliest_start, :format, "must have the correct format"},
             {:error, :latest_end, :format, "must have the correct format"}
           ]
  end
end
