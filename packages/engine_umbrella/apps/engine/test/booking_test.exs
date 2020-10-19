defmodule BookingTest do
  import TestHelper
  use ExUnit.Case

  test "it allows booking creation" do
    MessageGenerator.random_booking()
    |> Booking.make()

    booking_ids = Engine.BookingStore.get_bookings()
    clear_state()
    assert booking_ids |> length() == 1
  end

  test "does not allow malformed size (weight)" do
    MessageGenerator.random_booking(%{
      size: %{measurements: [14, 12, 10], weight: 1.2}
    })
    |> Booking.make()

    booking_ids = Engine.BookingStore.get_bookings()

    clear_state()
    assert booking_ids |> length() == 0
  end

  test "does not allow malformed size (measurements)" do
    MessageGenerator.random_booking(%{
      size: %{measurements: "12", weight: 1}
    })
    |> Booking.make()

    booking_ids = Engine.BookingStore.get_bookings()

    clear_state()
    assert booking_ids |> length() == 0
  end

  test "does not allow malformed measurements elements" do
    MessageGenerator.random_booking(%{
      size: %{measurements: ["12"], weight: 1}
    })
    |> Booking.make()

    booking_ids = Engine.BookingStore.get_bookings()

    clear_state()
    assert booking_ids |> length() == 0
  end

  test "does not allow incomplete measurements" do
    MessageGenerator.random_booking(%{
      size: %{measurements: [12], weight: 1}
    })
    |> Booking.make()

    booking_ids = Engine.BookingStore.get_bookings()

    clear_state()
    assert booking_ids |> length() == 0
  end

  test "allows correct measurements" do
    MessageGenerator.random_booking(%{
      size: %{measurements: [12, 14, 15], weight: 1}
    })
    |> Booking.make()

    booking_ids = Engine.BookingStore.get_bookings()

    clear_state()
    assert booking_ids |> length() == 1
  end
end
