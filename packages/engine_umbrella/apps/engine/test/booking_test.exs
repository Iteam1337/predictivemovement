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
