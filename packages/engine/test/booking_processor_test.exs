defmodule BookingProcessorTest do
  use ExUnit.Case, async: true
  import Mox

  stub(CandidatesMock, :find_optimal_routes, fn _, _ ->
    %{
      copyrights: ["GraphHopper", "OpenStreetMap contributors"],
      job_id: "5eff73a4-5eea-436b-b1bb-eb5be1f8f02c",
      processing_time: 39,
      solution: %{
        completion_time: 3236,
        costs: 236,
        distance: 35762,
        max_operation_time: 3236,
        no_unassigned: 0,
        no_vehicles: 1,
        preparation_time: 0,
        routes: [
          %{
            activities: [
              %{
                address: %{lat: 61.912113, location_id: "974609", lon: 16.270281},
                distance: 0,
                driving_time: 0,
                end_date_time: nil,
                end_time: 0,
                load_after: [0],
                location_id: "974609",
                preparation_time: 0,
                type: "start",
                waiting_time: 0
              },
              %{
                address: %{lat: 61.857838, location_id: "625568", lon: 16.233833},
                arr_date_time: nil,
                arr_time: 1268,
                distance: 13429,
                driving_time: 1268,
                end_date_time: nil,
                end_time: 1268,
                id: "56638",
                load_after: [1],
                load_before: [0],
                location_id: "625568",
                preparation_time: 0,
                type: "pickupShipment",
                waiting_time: 0
              },
              %{
                address: %{lat: 61.87035, location_id: "196232", lon: 15.916928},
                arr_date_time: nil,
                arr_time: 3236,
                distance: 35762,
                driving_time: 3236,
                end_date_time: nil,
                end_time: 3236,
                id: "56638",
                load_after: [0],
                load_before: [1],
                location_id: "196232",
                preparation_time: 0,
                type: "deliverShipment",
                waiting_time: 0
              }
            ],
            completion_time: 3236,
            distance: 35762,
            preparation_time: 0,
            service_duration: 0,
            transport_time: 3236,
            vehicle_id: "19817",
            waiting_time: 0
          }
        ],
        service_duration: 0,
        time: 3236,
        transport_time: 3236,
        unassigned: %{breaks: [], details: [], services: [], shipments: []},
        waiting_time: 0
      },
      status: "finished",
      waiting_time_in_queue: 0
    }
  end)

  stub(VehicleMock, :offer, fn _ -> true end)

  @christian %{lat: 59.338791, lon: 17.897773}
  @radu %{lat: 59.318672, lon: 18.072149}
  @kungstradgarden %{lat: 59.332632, lon: 18.071692}
  @iteam %{lat: 59.343664, lon: 18.069928}
  @ralis %{lat: 59.330513, lon: 18.018228}
  @stjarntorget %{lat: 59.3692505, lon: 18.0026196}

  @iteamToRadu %Booking{
    pickup: @iteam,
    delivery: @radu,
    id: "iteamToRadu"
  }

  @iteamToSeb %Booking{
    pickup: @iteam,
    delivery: @stjarntorget,
    id: "iteamToSeb"
  }

  @iteamToCinema %Booking{
    pickup: @iteam,
    delivery: @stjarntorget,
    id: "iteamToCinema"
  }

  @iteamToFoodCourt %Booking{
    pickup: @iteam,
    delivery: @stjarntorget,
    id: "iteamToFoodCourt"
  }

  @iteamToSystembolaget %Booking{
    pickup: @iteam,
    delivery: @stjarntorget,
    id: "iteamToSystembolaget"
  }

  @iteamToSats %Booking{
    pickup: @iteam,
    delivery: @stjarntorget,
    id: "iteamToSats"
  }

  @iteamToChristian %Booking{
    pickup: @iteam,
    delivery: @christian,
    id: "iteamToChristian"
  }

  @tesla %Vehicle{
    busy: false,
    heading: nil,
    id: "tesla",
    instructions: [],
    position: @iteam,
    orsm_route: nil
  }

  @volvo %Vehicle{
    busy: false,
    heading: nil,
    id: "volvo",
    instructions: [],
    position: @ralis,
    orsm_route: nil
  }

  @tag :only
  test "it picks the vehicle closest to the pickup location" do
    vehicles = [@tesla]
    bookings = [@iteamToRadu, @iteamToChristian]

    ref =
      Broadway.test_messages(Engine.BookingProcessor, [
        {vehicles, bookings}
      ])

    assert_receive {:ack, ^ref, messages, failed},
                   10000

    %Vehicle{id: "tesla", instructions: instructions} =
      messages
      |> Enum.map(fn %Broadway.Message{data: {vehicles, bookings}} -> List.first(vehicles) end)
      |> List.first()

    instructions
    |> Enum.filter(fn %{type: type} -> type != "start" end)
    |> Enum.all?(fn %{id: id} ->
      id == @iteamToRadu.id or id == @iteamToChristian.id
    end)
    |> assert()

    assert length(instructions) == 5
  end

  @tag :only
  test "the same vehicle gets all the bookings on the same route if it does not reach its capacity" do
    vehicles = [@tesla, @volvo]

    bookings = [
      @iteamToCinema,
      @iteamToSats,
      @iteamToSystembolaget,
      @iteamToFoodCourt,
      @iteamToSeb
    ]

    ref =
      Broadway.test_messages(Engine.BookingProcessor, [
        {vehicles, bookings}
      ])

    assert_receive {:ack, ^ref, messages, failed},
                   10000

    %Vehicle{id: "tesla", instructions: instructions} =
      messages
      |> Enum.map(fn %Broadway.Message{data: {vehicles, bookings}} -> List.first(vehicles) end)
      |> List.first()

    assert length(instructions) == 11
  end

  # test "it can get another order that is on the same route" do
  #   vehicles = [@tesla, @volvo]
  #   bookings = [@iteamToRadu, @iteamToChristian]

  #   ref =
  #     Broadway.test_messages(Engine.BookingProcessor, [
  #       {vehicles, bookings}
  #     ])

  #   assert_receive {:ack, ^ref, messages, failed},
  #                  10000

  #   %Vehicle{id: "tesla", instructions: instructions} =
  #     messages
  #     |> Enum.map(fn %Broadway.Message{data: {vehicles, bookings}} -> List.first(vehicles) end)
  #     |> List.first()

  #   instructions
  #   |> Enum.filter(fn %{type: type} -> type != "start" end)
  #   |> Enum.all?(fn %{id: id} ->
  #     id == @iteamToRadu.id or id == @iteamToChristian.id
  #   end)
  #   |> assert()
  # end

  # write a test case where you send 2 messages and you just test based on location that the closest vehicle is picked

  # booking1 = {}
  # booking2 = {}
  # vehicle1 = { instructions: []}
  # vehicle2 = { instructions: []}

  # vehicles = [vehicle1, vehicle2]

  # result = process.message(booking1, vehicles)

  # updated_vehicle1 = { instructions: [booking1] }
  # updated_vehicles = accept_offer(result)

  # updated_vehicles = [updated_vehicle1, vehicle2]

  # result = process.message(booking2, updated_vehicles)
  # a test case where you send 1 booking and 2 vehicles and then mock the offer acceptance and the updated state as vehicle input for another message
end

# test "bookings with two vehicles" do
#   vehicles = [@tesla, @volvo]

#   route =
#     [@iteamToRadu, @iteamToChristian]
#     |> Dispatch.find_candidates(vehicles)
#     |> pretty()
#     |> Enum.join(" -> ")

#   assert route == "(volvo) iteamToRadu -> (tesla) iteamToChristian"
# end
