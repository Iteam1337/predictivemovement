defmodule BookingProcessorTest do
  def amqp_url, do: "amqp://" <> Application.fetch_env!(:engine, :amqp_host)
  @clear_queue Application.compile_env!(:engine, :clear_match_producer_state_queue)
  @outgoing_plan_exchange Application.compile_env!(:engine, :outgoing_plan_exchange)
  use ExUnit.Case

  setup_all do
    {:ok, connection} = AMQP.Connection.open(amqp_url())
    {:ok, channel} = AMQP.Channel.open(connection)
    AMQP.Queue.bind(channel, @clear_queue, @clear_queue, routing_key: @clear_queue)
    AMQP.Queue.declare(channel, "get_plan", durable: false)
    AMQP.Queue.bind(channel, "get_plan", @outgoing_plan_exchange, routing_key: "")

    on_exit(fn ->
      AMQP.Channel.close(channel)
    end)

    %{channel: channel}
  end

  test "creates a plan for one vehicle and one booking", %{channel: channel} do
    AMQP.Basic.consume(channel, "get_plan", nil, no_ack: true)
    MessageGenerator.add_random_car()
    MessageGenerator.add_random_booking()
    plan = wait_for_message(channel, "get_plan")
    MQ.publish("clear queue", @clear_queue, @clear_queue)

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

    plan = wait_for_x_messages(2, channel, "get_plan")

    MQ.publish("clear queue", @clear_queue, @clear_queue)
    assert plan |> List.first() |> Map.get(:vehicles) |> length() == 1
    assert plan |> List.first() |> Map.get(:booking_ids) |> length() == 2
  end

  # Skip until bug in jsprit is fixed
  @tag :skip
  test "creates a plan for two vehicles, where each vehicle gets one", %{channel: channel} do
    AMQP.Basic.consume(channel, "get_plan", nil, no_ack: true)
    MessageGenerator.add_random_booking(:stockholm)
    MessageGenerator.add_random_booking(:gothenburg)
    MessageGenerator.add_random_car(:stockholm)
    MessageGenerator.add_random_car(:gothenburg)

    plan = wait_for_x_messages(2, channel, "get_plan")

    MQ.publish("clear queue", @clear_queue, @clear_queue)
    assert plan |> List.last() |> Map.get(:vehicles) |> length() == 2

    assert plan
           |> List.last()
           |> Map.get(:vehicles)
           |> List.first()
           |> Map.get(:booking_ids)
           |> length() == 1
  end

  test "vehicle with no end_address defined gets start_address as end_address", %{
    channel: channel
  } do
    AMQP.Basic.consume(channel, "get_plan", nil, no_ack: true)
    earliest_start = DateTime.utc_now()
    latest_end = DateTime.utc_now() |> DateTime.add(60 * 60 * 6)

    MessageGenerator.add_random_car(%{start_address: %{lat: 61.829182, lon: 16.0896213}})
    MessageGenerator.add_random_booking()
    plan = wait_for_message(channel, "get_plan")
    MQ.publish("clear queue", @clear_queue, @clear_queue)

    first_vehicle = plan |> Map.get(:vehicles) |> List.first()

    assert first_vehicle |> Map.get(:end_address) == %{lat: 61.829182, lon: 16.0896213}
  end

  test "vehicle with end_address defined", %{channel: channel} do
    AMQP.Basic.consume(channel, "get_plan", nil, no_ack: true)
    earliest_start = DateTime.utc_now()
    latest_end = DateTime.utc_now() |> DateTime.add(60 * 60 * 6)

    MessageGenerator.add_random_car(%{
      start_address: %{lat: 61.829182, lon: 16.0896213},
      end_address: %{lat: 51.829182, lon: 17.0896213}
    })

    MessageGenerator.add_random_booking()
    plan = wait_for_message(channel, "get_plan")
    MQ.publish("clear queue", @clear_queue, @clear_queue)

    first_vehicle = plan |> Map.get(:vehicles) |> List.first()

    assert first_vehicle |> Map.get(:end_address) == %{lat: 51.829182, lon: 17.0896213}
  end

  test "time window constrains is passed on from vehicle to plan", %{
    channel: channel
  } do
    AMQP.Basic.consume(channel, "get_plan", nil, no_ack: true)
    earliest_start = DateTime.utc_now()
    latest_end = DateTime.utc_now() |> DateTime.add(60 * 60 * 6)

    MessageGenerator.add_random_car(%{earliest_start: earliest_start, latest_end: latest_end})
    MessageGenerator.add_random_booking()

    plan = wait_for_message(channel, "get_plan")
    MQ.publish("clear queue", @clear_queue, @clear_queue)

    first_vehicle = plan |> Map.get(:vehicles) |> List.first()

    assert first_vehicle |> Map.get(:earliest_start) ==
             earliest_start |> DateTime.to_iso8601()

    assert first_vehicle |> Map.get(:latest_end) ==
             latest_end |> DateTime.to_iso8601()
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

    plan = wait_for_message(channel, "get_plan")
    MQ.publish("clear queue", @clear_queue, @clear_queue)

    first_vehicle = plan |> Map.get(:vehicles) |> List.first()

    assert first_vehicle |> Map.get(:capacity) == %{weight: 731, volume: 18}
  end

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

    plan = wait_for_message(channel, "get_plan")
    MQ.publish("clear queue", @clear_queue, @clear_queue)

    assert plan |> Map.get(:vehicles) |> length() == 0
  end

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

    plan = wait_for_message(channel, "get_plan")
    MQ.publish("clear queue", @clear_queue, @clear_queue)

    assert plan |> Map.get(:vehicles) |> length() == 0
  end

  def wait_for_x_messages(x, channel, exchange),
    do: do_wait_for_x_messages([], channel, exchange, "", x)

  def do_wait_for_x_messages(messages, channel, _exchange, consumer_tag, 0) do
    AMQP.Basic.cancel(channel, consumer_tag)
    messages
  end

  def do_wait_for_x_messages(messages, channel, exchange, consumer_tag, x) do
    receive do
      {:basic_deliver, payload, %{consumer_tag: ^consumer_tag}} ->
        decoded =
          payload
          |> Poison.decode!(%{keys: :atoms})

        messages
        |> List.insert_at(-1, decoded)
        |> do_wait_for_x_messages(channel, exchange, consumer_tag, x - 1)

      {:basic_consume_ok, %{consumer_tag: consumer_tag}} ->
        do_wait_for_x_messages(messages, channel, exchange, consumer_tag, x)

      _ ->
        do_wait_for_x_messages(messages, channel, exchange, consumer_tag, x)
    end
  end

  def wait_for_message(channel, exchange, consumer_tag \\ "") do
    receive do
      {:basic_deliver, payload, %{consumer_tag: ^consumer_tag}} ->
        AMQP.Basic.cancel(channel, consumer_tag)

        payload
        |> Poison.decode!(%{keys: :atoms})

      {:basic_consume_ok, %{consumer_tag: consumer_tag}} ->
        wait_for_message(channel, exchange, consumer_tag)

      payload ->
        wait_for_message(channel, exchange, consumer_tag)
    end
  end
end
