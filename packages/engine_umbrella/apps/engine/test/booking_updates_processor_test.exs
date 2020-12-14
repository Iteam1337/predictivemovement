defmodule BookingUpdatesProcessorTest do
  use ExUnit.Case
  import TestHelper
  import Mox
  alias Engine.Adapters.RMQ

  setup do
    Engine.Adapters.MockRMQ
    |> stub(:publish, fn data, _, _ -> data end)
    |> stub(:publish, fn data, _ -> data end)

    :ok
  end

  def amqp_url, do: "amqp://" <> Application.fetch_env!(:engine, :amqp_host)
  @outgoing_booking_exchange Application.compile_env!(:engine, :outgoing_booking_exchange)
  @incoming_booking_exchange Application.compile_env!(:engine, :incoming_booking_exchange)

  setup_all do
    {:ok, connection} = AMQP.Connection.open(amqp_url())
    {:ok, channel} = AMQP.Channel.open(connection)
    AMQP.Queue.declare(channel, "look_for_picked_up_updates_in_test", durable: true)
    AMQP.Queue.declare(channel, "look_for_delivered_updates_in_test", durable: true)

    AMQP.Queue.bind(channel, "look_for_picked_up_updates_in_test", @outgoing_booking_exchange,
      routing_key: "picked_up"
    )

    AMQP.Queue.bind(channel, "look_for_delivered_updates_in_test", @outgoing_booking_exchange,
      routing_key: "delivered"
    )

    on_exit(fn ->
      AMQP.Channel.close(channel)
      AMQP.Connection.close(connection)
    end)

    %{channel: channel}
  end

  test "pickup update is registered", %{channel: channel} do
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

  test "delivered update is registered and published", %{channel: channel} do
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
