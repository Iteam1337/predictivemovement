defmodule BookingTest do
  import TestHelper
  use ExUnit.Case

  test "it allows booking creation" do
    result =
      MessageGenerator.random_booking()
      |> Booking.make()

    assert is_binary(result)
    clear_state()
  end

  test "does not allow malformed size (weight)" do
    result =
      MessageGenerator.random_booking(%{
        size: %{measurements: [14, 12, 10], weight: 1.2}
      })
      |> Booking.make()

    assert result == [{:error, [:size, :weight], :by, "must be an integer"}]
  end

  test "does not allow malformed size (measurements)" do
    result =
      MessageGenerator.random_booking(%{
        size: %{measurements: "12", weight: 1}
      })
      |> Booking.make()

    assert result == [
             {:error, [:size, :measurements], :by, "must be a list of integers"},
             {:error, [:size, :measurements], :length, "must have a length of 3"}
           ]
  end

  test "does not allow malformed measurements elements" do
    result =
      MessageGenerator.random_booking(%{
        size: %{measurements: ["12"], weight: 1}
      })
      |> Booking.make()

    assert result == [
             {:error, [:size, :measurements], :by, "must be a list of integers"},
             {:error, [:size, :measurements], :length, "must have a length of 3"}
           ]
  end

  test "does not allow incomplete measurements" do
    result =
      MessageGenerator.random_booking(%{
        size: %{measurements: [12], weight: 1}
      })
      |> Booking.make()

    assert result == [{:error, [:size, :measurements], :length, "must have a length of 3"}]
  end

  test "allows correct measurements" do
    result =
      MessageGenerator.random_booking(%{
        size: %{measurements: [12, 14, 15], weight: 1}
      })
      |> Booking.make()

    assert is_binary(result)
    clear_state()
  end

  test "should validate booking addresses containing lat/lon" do
    result =
      MessageGenerator.random_booking()
      |> Map.put(:pickup, %{city: "", name: "hafdoajgjagia", street: ""})
      |> Map.put(:delivery, %{city: "", name: "hafdoajgjagia", street: ""})
      |> Booking.make()

    assert result == [
             {:error, [:delivery, :lat], :number, "must be a number"},
             {:error, [:delivery, :lon], :number, "must be a number"},
             {:error, [:pickup, :lat], :number, "must be a number"},
             {:error, [:pickup, :lon], :number, "must be a number"}
           ]
  end

  test "should validate booking addresses lat/lon in correct format" do
    result =
      MessageGenerator.random_booking()
      |> Map.put(:pickup, %{
        lat: "2321321",
        lon: "dkdsakjdsa",
        city: "",
        name: "hafdoajgjagia",
        street: ""
      })
      |> Map.put(:delivery, %{
        lat: "2321321",
        lon: "dkdsakjdsa",
        city: "",
        name: "hafdoajgjagia",
        street: ""
      })
      |> Booking.make()

    assert result == [
             {:error, [:delivery, :lat], :number, "must be a number"},
             {:error, [:delivery, :lon], :number, "must be a number"},
             {:error, [:pickup, :lat], :number, "must be a number"},
             {:error, [:pickup, :lon], :number, "must be a number"}
           ]
  end
end
