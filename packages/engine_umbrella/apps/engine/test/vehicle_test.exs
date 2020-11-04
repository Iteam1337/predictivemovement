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

    assert result == [
             {:error, :start_address, :presence, "must be present"},
             {:error, [:end_address, :lat], :number, "must be a number"},
             {:error, [:end_address, :lon], :number, "must be a number"},
             {:error, [:start_address, :lat], :number, "must be a number"},
             {:error, [:start_address, :lon], :number, "must be a number"}
           ]
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

  test "should validate addresses containing lat/lon" do
    result =
      MessageGenerator.random_car(%{
        capacity: %{volume: 1, weight: 123},
        earliest_start: nil,
        latest_end: nil,
        metadata: %{driver: %{}, profile: "123"},
        start_address: %{city: "", name: "hafdoajgjagia", street: ""}
      })
      |> Vehicle.make()

    assert result == [
             {:error, [:end_address, :lat], :number, "must be a number"},
             {:error, [:end_address, :lon], :number, "must be a number"},
             {:error, [:start_address, :lat], :number, "must be a number"},
             {:error, [:start_address, :lon], :number, "must be a number"}
           ]
  end

  test "should validate addresses lat/lon in correct format" do
    result =
      MessageGenerator.random_car(%{
        capacity: %{volume: 1, weight: 123},
        earliest_start: nil,
        latest_end: nil,
        metadata: %{driver: %{}, profile: "123"},
        start_address: %{
          lat: "21321321",
          lon: "2321312",
          city: "",
          name: "hafdoajgjagia",
          street: ""
        }
      })
      |> Vehicle.make()

    assert result == [
             {:error, [:end_address, :lat], :number, "must be a number"},
             {:error, [:end_address, :lon], :number, "must be a number"},
             {:error, [:start_address, :lat], :number, "must be a number"},
             {:error, [:start_address, :lon], :number, "must be a number"}
           ]
  end
end
