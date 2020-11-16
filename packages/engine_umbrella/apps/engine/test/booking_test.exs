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

  test "requires that delivery is present" do
    MessageGenerator.random_booking()
    |> Map.delete(:delivery)
    |> Booking.make()
    |> catch_error()
  end

  test "requires that pickup is present" do
    MessageGenerator.random_booking()
    |> Map.delete(:pickup)
    |> Booking.make()
    |> catch_error()
  end

  @tag :only
  test "should allow booking to be updated" do
    id =
      MessageGenerator.random_booking()
      |> Booking.make()

    updated_booking = %{
      delivery: %{lat: 13.37, lon: 13.37},
      external_id: 1337,
      id: id,
      pickup: %{lat: 13.37, lon: 13.37},
      size: %{measurements: [1, 2, 3], weight: 1337}
    }

    Booking.update(updated_booking)

    %{delivery: delivery, pickup: pickup, external_id: external_id, size: size} = Booking.get(id)

    assert delivery == updated_booking.delivery
    assert pickup == updated_booking.pickup
    assert external_id == updated_booking.external_id
    assert size == updated_booking.size
  end
end
