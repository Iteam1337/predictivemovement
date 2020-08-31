defmodule BookingProcessorTest do
  def amqp_url, do: "amqp://" <> Application.fetch_env!(:engine, :amqp_host)
  @clear_queue Application.compile_env!(:engine, :clear_match_producer_state_queue)
  use ExUnit.Case

  setup_all do
    {:ok, connection} = AMQP.Connection.open(amqp_url())
    {:ok, channel} = AMQP.Channel.open(connection)
    AMQP.Queue.bind(channel, @clear_queue, @clear_queue, routing_key: @clear_queue)
    AMQP.Queue.declare(channel, "get_plan", durable: false)
    AMQP.Queue.bind(channel, "get_plan", "plan", routing_key: "")

    on_exit(fn ->
      AMQP.Channel.close(channel)
    end)

    %{channel: channel}
  end

  @tag :only
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

  # @tag :only
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

  # test "creates a plan for two vehicles, where each vehicle gets one" do

  # end

  # test "vehicle with no end_address defined" do
  # end

  # @tag :only
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

  # test "volume constraints" do

  # end

  # test "weig"

  # end

  def wait_for_x_messages(x, channel, exchange),
    do: do_wait_for_x_messages([], channel, exchange, "", x)

  def do_wait_for_x_messages(messages, _channel, _exchange, _consumer_tag, 0), do: messages

  def do_wait_for_x_messages(messages, channel, exchange, consumer_tag, x) do
    receive do
      {:basic_deliver, payload, %{exchange: exchange, consumer_tag: ^consumer_tag}} ->
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
      {:basic_deliver, payload, %{exchange: ^exchange, consumer_tag: ^consumer_tag}} ->
        AMQP.Basic.cancel(channel, consumer_tag)
        IO.puts("here")

        payload
        |> Poison.decode!(%{keys: :atoms})

      {:basic_consume_ok, %{consumer_tag: consumer_tag}} ->
        wait_for_message(channel, exchange, consumer_tag)

      _ ->
        wait_for_message(channel, exchange, consumer_tag)
    end
  end
end

#   import Mox
#   setup :set_mox_from_context
#   setup :verify_on_exit!
#   @christian %{lat: 59.338791, lon: 17.897773}
#   @radu %{lat: 59.318672, lon: 18.072149}
#   @kungstradgarden %{lat: 59.332632, lon: 18.071692}
#   @iteam %{lat: 59.343664, lon: 18.069928}
#   @ralis %{lat: 59.330513, lon: 18.018228}
#   @stjarntorget %{lat: 59.3692505, lon: 18.0026196}

#   @iteamToRadu %Booking{
#     pickup: @iteam,
#     delivery: @radu,
#     id: "iteamToRadu"
#   }

#   @iteamToSeb %Booking{
#     pickup: @iteam,
#     delivery: @stjarntorget,
#     id: "iteamToSeb"
#   }

#   @iteamToCinema %Booking{
#     pickup: @iteam,
#     delivery: @stjarntorget,
#     id: "iteamToCinema"
#   }

#   @iteamToFoodCourt %Booking{
#     pickup: @iteam,
#     delivery: @stjarntorget,
#     id: "iteamToFoodCourt"
#   }

#   @iteamToSystembolaget %Booking{
#     pickup: @iteam,
#     delivery: @stjarntorget,
#     id: "iteamToSystembolaget"
#   }

#   @iteamToSats %Booking{
#     pickup: @iteam,
#     delivery: @stjarntorget,
#     id: "iteamToSats"
#   }

#   @iteamToChristian %Booking{
#     pickup: @iteam,
#     delivery: @christian,
#     id: "iteamToChristian"
#   }

#   @tesla %Vehicle{
#     busy: false,
#     heading: nil,
#     id: "tesla",
#     instructions: [],
#     position: @iteam,
#     orsm_route: nil
#   }

#   @volvo %Vehicle{
#     busy: false,
#     heading: nil,
#     id: "volvo",
#     instructions: [],
#     position: @ralis,
#     orsm_route: nil
#   }
#   @plan_response_with_one_booking_for_tesla %{
#     copyrights: ["GraphHopper", "OpenStreetMap contributors"],
#     job_id: "f7e0a92a-8dc1-4b4c-b8c1-7365e4eb90ad",
#     processing_time: 69,
#     solution: %{
#       completion_time: 655,
#       costs: 207,
#       distance: 5917,
#       max_operation_time: 655,
#       no_unassigned: 0,
#       no_vehicles: 1,
#       preparation_time: 0,
#       routes: [
#         %{
#           activities: [
#             %{
#               address: %{
#                 lat: @iteamToRadu.pickup.lat,
#                 location_id: "502",
#                 lon: @iteamToRadu.pickup.lon
#               },
#               distance: 0,
#               driving_time: 0,
#               end_date_time: nil,
#               end_time: 0,
#               load_after: [0],
#               location_id: "502",
#               preparation_time: 0,
#               type: "start",
#               waiting_time: 0
#             },
#             %{
#               address: %{lat: 59.343664, location_id: "863628", lon: 18.069928},
#               arr_date_time: nil,
#               arr_time: 0,
#               distance: 0,
#               driving_time: 0,
#               end_date_time: nil,
#               end_time: 0,
#               id: "iteamToRadu",
#               load_after: [2],
#               load_before: [1],
#               location_id: "863628",
#               preparation_time: 0,
#               type: "pickupShipment",
#               waiting_time: 0
#             },
#             %{
#               address: %{
#                 lat: @iteamToRadu.delivery.lat,
#                 location_id: "76605",
#                 lon: @iteamToRadu.delivery.lon
#               },
#               arr_date_time: nil,
#               arr_time: 655,
#               distance: 5917,
#               driving_time: 655,
#               end_date_time: nil,
#               end_time: 655,
#               id: "iteamToRadu",
#               load_after: [4],
#               load_before: [5],
#               location_id: "76605",
#               preparation_time: 0,
#               type: "deliverShipment",
#               waiting_time: 0
#             }
#           ],
#           completion_time: 655,
#           distance: 5917,
#           preparation_time: 0,
#           service_duration: 0,
#           transport_time: 655,
#           vehicle_id: "tesla",
#           waiting_time: 0
#         }
#       ],
#       service_duration: 0,
#       time: 655,
#       transport_time: 655,
#       unassigned: %{breaks: [], details: [], services: [], shipments: []},
#       waiting_time: 0
#     },
#     status: "finished",
#     waiting_time_in_queue: 0
#   }

#   @tag :only
#   test "it stores plan made by Plan Module" do
#     vehicles = [@tesla, @volvo]
#     bookings = [@iteamToRadu]

#     PlanBehaviourMock
#     |> stub(:find_optimal_routes, fn _, _ -> @plan_response_with_one_booking_for_tesla end)

#     ref =
#       Broadway.test_messages(Engine.BookingProcessor, [
#         {vehicles, bookings}
#       ])

#     assert_receive {:ack, ^ref, messages, failed},
#                    10000

#     [%Vehicle{id: "tesla", instructions: instructions}] = PlanStore.get_plan()

#     assert length(instructions) == 3
#   end

#   @tag :only
#   test "it only stores latest plan response" do
#     vehicles = [@tesla, @volvo]
#     bookings = [@iteamToRadu]

#     stub(PlanBehaviourMock, :find_optimal_routes, fn _, _ ->
#       @plan_response_with_one_booking_for_tesla
#     end)

#     ref =
#       Broadway.test_messages(Engine.BookingProcessor, [
#         {vehicles, bookings}
#       ])

#     assert_receive {:ack, ^ref, messages, failed},
#                    10000

#     volvo_is_best_match =
#       update_in(@plan_response_with_one_booking_for_tesla, [:solution, :routes], fn [routes] ->
#         [Map.put(routes, :vehicle_id, "volvo")]
#       end)

#     stub(PlanBehaviourMock, :find_optimal_routes, fn _, _ -> volvo_is_best_match end)

#     ref =
#       Broadway.test_messages(Engine.BookingProcessor, [
#         {vehicles, bookings}
#       ])

#     assert_receive {:ack, ^ref, messages, failed},
#                    10000

#     [%Vehicle{id: "volvo", instructions: instructions}] = PlanStore.get_plan()

#     assert length(instructions) == 3
#   end

#   # This test should be moved to a more "e2e" location to test that our get_optimal_routes backend works properly
#   # test "the same vehicle gets all the bookings on the same route if it does not reach its capacity" do
#   #   vehicles = [@tesla, @volvo]

#   #   bookings = [
#   #     @iteamToCinema,
#   #     @iteamToSats,
#   #     @iteamToSystembolaget,
#   #     @iteamToFoodCourt,
#   #     @iteamToSeb
#   #   ]

#   #   ref =
#   #     Broadway.test_messages(Engine.BookingProcessor, [
#   #       {vehicles, bookings}
#   #     ])

#   #   assert_receive {:ack, ^ref, messages, failed},
#   #                  10000

#   #   {%Vehicle{id: "tesla", instructions: instructions}, _} = PlanStore.get_plan()

#   #   assert length(instructions) == 11
#   # end

#   # test "it can get another order that is on the same route" do
#   #   vehicles = [@tesla, @volvo]
#   #   bookings = [@iteamToRadu, @iteamToChristian]

#   #   ref =
#   #     Broadway.test_messages(Engine.BookingProcessor, [
#   #       {vehicles, bookings}
#   #     ])

#   #   assert_receive {:ack, ^ref, messages, failed},
#   #                  10000

#   #   %Vehicle{id: "tesla", instructions: instructions} =
#   #     messages
#   #     |> Enum.map(fn %Broadway.Message{data: {vehicles, bookings}} -> List.first(vehicles) end)
#   #     |> List.first()

#   #   instructions
#   #   |> Enum.filter(fn %{type: type} -> type != "start" end)
#   #   |> Enum.all?(fn %{id: id} ->
#   #     id == @iteamToRadu.id or id == @iteamToChristian.id
#   #   end)
#   #   |> assert()
#   # end

#   # write a test case where you send 2 messages and you just test based on location that the closest vehicle is picked

#   # booking1 = {}
#   # booking2 = {}
#   # vehicle1 = { instructions: []}
#   # vehicle2 = { instructions: []}

#   # vehicles = [vehicle1, vehicle2]

#   # result = process.message(booking1, vehicles)

#   # updated_vehicle1 = { instructions: [booking1] }
#   # updated_vehicles = accept_offer(result)

#   # updated_vehicles = [updated_vehicle1, vehicle2]

#   # result = process.message(booking2, updated_vehicles)
#   # a test case where you send 1 booking and 2 vehicles and then mock the offer acceptance and the updated state as vehicle input for another message
# end
