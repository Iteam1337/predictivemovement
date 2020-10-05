defmodule BookingProcessorTest do
  import TestHelper
  def amqp_url, do: "amqp://" <> Application.fetch_env!(:engine, :amqp_host)
  @outgoing_plan_exchange Application.compile_env!(:engine, :outgoing_plan_exchange)
  use ExUnit.Case

  setup_all do
    {:ok, connection} = AMQP.Connection.open(amqp_url())
    {:ok, channel} = AMQP.Channel.open(connection)
    AMQP.Queue.declare(channel, "get_plan", durable: false)
    AMQP.Queue.bind(channel, "get_plan", @outgoing_plan_exchange, routing_key: "")

    on_exit(fn ->
      clear_state()
      AMQP.Channel.close(channel)
      AMQP.Connection.close(connection)
    end)

    %{channel: channel}
  end

  test "creates a plan for one vehicle and one booking", %{channel: channel} do
    AMQP.Basic.consume(channel, "get_plan", nil, no_ack: true)
    MessageGenerator.add_random_car()
    MessageGenerator.add_random_booking()
    plan = wait_for_message(channel)
    clear_state()

    assert Map.get(plan, :booking_ids) |> length() == 1
    assert Map.get(plan, :vehicles) |> length() == 1
    assert Map.get(plan, :vehicles) |> List.first() |> Map.get(:earliest_start) == nil
  end

  test "creates a plan where one vehicle gets two bookings and one gets zero", %{channel: channel} do
    AMQP.Basic.consume(channel, "get_plan", nil, no_ack: true)
    MessageGenerator.add_random_booking(:stockholm)
    MessageGenerator.add_random_booking(:stockholm)
    MessageGenerator.add_random_car(:stockholm)
    MessageGenerator.add_random_car(:gothenburg)

    plan = wait_for_x_messages(2, channel)

    clear_state()
    assert plan |> List.first() |> Map.get(:vehicles) |> length() == 1
    assert plan |> List.first() |> Map.get(:booking_ids) |> length() == 2
  end

  test "creates a plan for two vehicles, where each vehicle gets one", %{channel: channel} do
    AMQP.Basic.consume(channel, "get_plan", nil, no_ack: true)
    MessageGenerator.add_random_booking(:stockholm)
    MessageGenerator.add_random_booking(:gothenburg)
    MessageGenerator.add_random_car(:stockholm)
    MessageGenerator.add_random_car(:gothenburg)

    plan =
      wait_for_x_messages(2, channel)
      |> Enum.sort(&(length(&1.vehicles) > length(&2.vehicles)))
      |> List.first()

    clear_state()

    assert 2 ==
             plan
             |> Map.get(:vehicles)
             |> length()

    assert plan
           |> Map.get(:vehicles)
           |> List.first()
           |> Map.get(:booking_ids)
           |> length() == 1
  end

  test "vehicle with no end_address defined gets start_address as end_address", %{
    channel: channel
  } do
    AMQP.Basic.consume(channel, "get_plan", nil, no_ack: true)

    MessageGenerator.add_random_car(%{start_address: %{lat: 61.829182, lon: 16.0896213}})
    MessageGenerator.add_random_booking()
    plan = wait_for_message(channel)
    clear_state()

    first_vehicle = plan |> Map.get(:vehicles) |> List.first()

    assert first_vehicle |> Map.get(:end_address) == %{lat: 61.829182, lon: 16.0896213}
  end

  test "vehicle with end_address defined", %{channel: channel} do
    AMQP.Basic.consume(channel, "get_plan", nil, no_ack: true)

    MessageGenerator.add_random_car(%{
      start_address: %{lat: 61.829182, lon: 16.0896213},
      end_address: %{lat: 51.829182, lon: 17.0896213}
    })

    MessageGenerator.add_random_booking()
    plan = wait_for_message(channel)
    clear_state()

    first_vehicle = plan |> Map.get(:vehicles) |> List.first()

    assert first_vehicle |> Map.get(:end_address) == %{lat: 51.829182, lon: 17.0896213}
  end

  test "time window constrains is passed on from vehicle to plan", %{
    channel: channel
  } do
    AMQP.Basic.consume(channel, "get_plan", nil, no_ack: true)
    now = DateTime.utc_now()
    later = now |> DateTime.add(60 * 60 * 6)
    {:ok, earliest_start} = Engine.Cldr.DateTime.to_string(now, format: "HH:mm")
    {:ok, latest_end} = Engine.Cldr.DateTime.to_string(later, format: "HH:mm")

    MessageGenerator.add_random_car(%{earliest_start: earliest_start, latest_end: latest_end})
    MessageGenerator.add_random_booking()

    plan = wait_for_message(channel)
    clear_state()

    first_vehicle = plan |> Map.get(:vehicles) |> List.first()

    assert first_vehicle |> Map.get(:earliest_start) ==
             earliest_start

    assert first_vehicle |> Map.get(:latest_end) ==
             latest_end
  end

  test "capacity is included in the plan", %{
    channel: channel
  } do
    AMQP.Basic.consume(channel, "get_plan", nil, no_ack: true)

    MessageGenerator.add_random_car(%{
      capacity: %{weight: 731, volume: 18}
    })

    MessageGenerator.add_random_booking(%{
      size: %{measurements: [14, 12, 10], weight: 1}
    })

    plan = wait_for_message(channel)
    clear_state()

    first_vehicle = plan |> Map.get(:vehicles) |> List.first()

    assert first_vehicle |> Map.get(:capacity) == %{weight: 731, volume: 18}
  end

  @tag :skip
  test "vehicle with too small storage doesn't get assigned", %{
    channel: channel
  } do
    AMQP.Basic.consume(channel, "get_plan", nil, no_ack: true)

    MessageGenerator.add_random_car(%{
      capacity: %{weight: 700, volume: 1}
    })

    MessageGenerator.add_random_booking(%{
      size: %{measurements: [100, 100, 101], weight: 2}
    })

    plan = wait_for_message(channel)
    clear_state()

    assert plan |> Map.get(:vehicles) |> length() == 0
  end

  @tag :skip
  test "vehicle with too little weight capabilities doesn't get assigned", %{
    channel: channel
  } do
    AMQP.Basic.consume(channel, "get_plan", nil, no_ack: true)

    MessageGenerator.add_random_car(%{
      capacity: %{weight: 50, volume: 18}
    })

    MessageGenerator.add_random_booking(%{
      size: %{measurements: [14, 12, 10], weight: 100}
    })

    plan = wait_for_message(channel)
    clear_state()

    assert plan |> Map.get(:vehicles) |> length() == 0
  end

  test "bookings with same pickup should work just fine", %{
    channel: channel
  } do
    AMQP.Basic.consume(channel, "get_plan", nil, no_ack: true)

    MessageGenerator.add_random_booking(%{
      pickup: %{lat: 61.829182, lon: 16.0896213}
    })

    MessageGenerator.add_random_booking(%{
      pickup: %{lat: 61.829182, lon: 16.0896213}
    })

    MessageGenerator.add_random_booking(%{
      delivery: %{lat: 61.829182, lon: 16.0896213}
    })

    MessageGenerator.add_random_car(%{start_address: %{lat: 60.1111, lon: 16.07544}})

    plan = wait_for_message(channel)

    clear_state()

    assert Map.get(plan, :vehicles) |> length() == 1
    assert Map.get(plan, :booking_ids) |> length() == 3
  end
end
