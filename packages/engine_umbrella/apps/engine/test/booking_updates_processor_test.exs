defmodule BookingUpdatesProcessorTest do
  use ExUnit.Case
  import TestHelper
  alias Engine.Adapters.RMQ
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
      clear_state()
      AMQP.Channel.close(channel)
      AMQP.Connection.close(connection)
    end)

    %{channel: channel}
  end

  test "pickup update is registered and published", %{channel: channel} do
    AMQP.Basic.consume(channel, "look_for_picked_up_updates_in_test", nil, no_ack: true)

    vehicle_id = Vehicle.make(%{start_address: %{lat: 61.80762475411504, lon: 16.05761905846783}})

    booking_id =
      Booking.make(%{
        id: 1,
        size: %{weight: 1, measurements: [1, 1, 1]},
        pickup: %{lat: 61.80762475411504, lon: 16.05761905846783},
        delivery: %{lat: 61.80762475411504, lon: 17.05761905846783},
        metadata: %{senderId: "telegramIdString"}
      })

    Booking.assign(booking_id, Vehicle.get(vehicle_id))
    send_status_msg(booking_id, vehicle_id, "picked_up")
    update = wait_for_message(channel)
    assert Map.get(update, :metadata) == "{\"senderId\":\"telegramIdString\"}"

    assert :picked_up ==
             Booking.get(booking_id)
             |> Map.get(:events)
             |> List.first()
             |> Map.get(:type)
  end

  test "delivered update is registered and published", %{channel: channel} do
    AMQP.Basic.consume(channel, "look_for_delivered_updates_in_test", nil, no_ack: true)

    vehicle_id = Vehicle.make(%{start_address: %{lat: 61.80762475411504, lon: 16.05761905846783}})

    booking_id =
      Booking.make(%{
        id: 1,
        size: %{weight: 1, measurements: [1, 1, 1]},
        pickup: %{lat: 61.80762475411504, lon: 16.05761905846783},
        delivery: %{lat: 61.80762475411504, lon: 17.05761905846783},
        metadata: %{senderId: "telegramIdString"}
      })

    Booking.assign(booking_id, Vehicle.get(vehicle_id))
    send_status_msg(booking_id, vehicle_id, "delivered")
    update = wait_for_message(channel)
    assert Map.get(update, :metadata) == "{\"senderId\":\"telegramIdString\"}"

    assert :delivered ==
             Booking.get(booking_id)
             |> Map.get(:events)
             |> List.first()
             |> Map.get(:type)
  end

  def send_status_msg(booking_id, vehicle_id, status) do
    RMQ.publish(
      %{
        assigned_to: %{
          id: vehicle_id,
          metadata: %{telegram: %{senderId: 1_242_301_357}}
        },
        delivery: %{lat: 61.75485695153156, lon: 15.989146086447738},
        events: [],
        id: booking_id,
        metadata: %{},
        pickup: %{lat: 61.80762475411504, lon: 16.05761905846783},
        size: %{weight: 1, measurements: [1, 1, 1]},
        status: status
      },
      @incoming_booking_exchange,
      status
    )
  end
end
