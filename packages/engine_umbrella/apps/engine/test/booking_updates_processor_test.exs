defmodule BookingUpdatesProcessorTest do
  use ExUnit.Case
  import TestHelper
  import Mox

  setup do
    Engine.Adapters.MockRMQ
    |> stub(:publish, fn data, _, _ -> data end)
    |> stub(:publish, fn data, _ -> data end)

    :ok
  end

  test "pickup update is registered" do
    vehicle_id = Vehicle.make(%{start_address: %{lat: 61.80762475411504, lon: 16.05761905846783}})

    booking_id =
      Booking.make(%{
        external_id: 1,
        size: %{weight: 1, measurements: [1, 1, 1]},
        pickup: %{lat: 61.80762475411504, lon: 16.05761905846783},
        delivery: %{lat: 61.80762475411504, lon: 17.05761905846783},
        metadata: %{senderId: "telegramIdString"}
      })

    Booking.assign(booking_id, Vehicle.get(vehicle_id))

    ref =
      Broadway.test_message(
        Engine.BookingUpdatesProcessor,
        Jason.encode!(%{
          "id" => booking_id,
          "status" => "picked_up"
        })
      )

    assert_receive {:ack, ^ref, _, _}, 500

    assert :picked_up ==
             Booking.get(booking_id)
             |> Map.get(:events)
             |> List.first()
             |> Map.get(:type)
  end

  test "delivered update is registered and published" do
    vehicle_id = Vehicle.make(%{start_address: %{lat: 61.80762475411504, lon: 16.05761905846783}})

    booking_id =
      Booking.make(%{
        external_id: 1,
        size: %{weight: 1, measurements: [1, 1, 1]},
        pickup: %{lat: 61.80762475411504, lon: 16.05761905846783},
        delivery: %{lat: 61.80762475411504, lon: 17.05761905846783},
        metadata: %{senderId: "telegramIdString"}
      })

    Booking.assign(booking_id, Vehicle.get(vehicle_id))

    ref =
      Broadway.test_message(
        Engine.BookingUpdatesProcessor,
        Jason.encode!(%{
          "id" => booking_id,
          "status" => "delivered"
        })
      )

    assert_receive {:ack, ^ref, _, _}, 500

    assert :delivered ==
             Booking.get(booking_id)
             |> Map.get(:events)
             |> List.first()
             |> Map.get(:type)
  end
end
