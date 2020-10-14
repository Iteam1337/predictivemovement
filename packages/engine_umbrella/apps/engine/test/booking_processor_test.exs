defmodule BookingProcessorTest do
  import TestHelper
  def amqp_url, do: "amqp://" <> Application.fetch_env!(:engine, :amqp_host)
  @outgoing_plan_exchange Application.compile_env!(:engine, :outgoing_plan_exchange)
  use ExUnit.Case

  test "creates a plan for one vehicle and one booking" do
    MessageGenerator.random_car()
    |> Vehicle.make()

    MessageGenerator.random_booking()
    |> Booking.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()
    booking_ids = Engine.BookingStore.get_bookings()
    Engine.BookingProcessor.calculate_plan(vehicle_ids, booking_ids)
    plan = PlanStore.get_plan()
    clear_state()

    assert Map.get(plan, :booking_ids) |> length() == 1
    assert Map.get(plan, :vehicles) |> length() == 1
    assert Map.get(plan, :vehicles) |> List.first() |> Map.get(:earliest_start) == nil
  end

  test "creates a plan where one vehicle gets two bookings and one gets zero" do
    MessageGenerator.random_car()
    |> MessageGenerator.add_vehicle_addresses(:stockholm)
    |> Vehicle.make()

    MessageGenerator.random_car()
    |> MessageGenerator.add_vehicle_addresses(:gothenburg)
    |> Vehicle.make()

    MessageGenerator.random_booking()
    |> MessageGenerator.add_booking_addresses(:stockholm)
    |> Booking.make()

    MessageGenerator.random_booking()
    |> MessageGenerator.add_booking_addresses(:stockholm)
    |> Booking.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()
    booking_ids = Engine.BookingStore.get_bookings()
    Engine.BookingProcessor.calculate_plan(vehicle_ids, booking_ids)
    plan = PlanStore.get_plan()

    clear_state()
    assert plan |> Map.get(:vehicles) |> length() == 1
    assert plan |> Map.get(:booking_ids) |> length() == 2
  end

  test "creates a plan for two vehicles, where each vehicle gets one" do
    MessageGenerator.random_car()
    |> MessageGenerator.add_vehicle_addresses(:stockholm)
    |> Vehicle.make()

    MessageGenerator.random_car()
    |> MessageGenerator.add_vehicle_addresses(:gothenburg)
    |> Vehicle.make()

    MessageGenerator.random_booking()
    |> MessageGenerator.add_booking_addresses(:stockholm)
    |> Booking.make()

    MessageGenerator.random_booking()
    |> MessageGenerator.add_booking_addresses(:gothenburg)
    |> Booking.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()
    booking_ids = Engine.BookingStore.get_bookings()
    Engine.BookingProcessor.calculate_plan(vehicle_ids, booking_ids)
    plan = PlanStore.get_plan()

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

  test "vehicle with no end_address defined gets start_address as end_address" do
    MessageGenerator.random_car(%{start_address: %{lat: 61.829182, lon: 16.0896213}})
    |> Vehicle.make()

    MessageGenerator.random_booking()
    |> Booking.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()
    booking_ids = Engine.BookingStore.get_bookings()
    Engine.BookingProcessor.calculate_plan(vehicle_ids, booking_ids)
    plan = PlanStore.get_plan()

    clear_state()

    first_vehicle = plan |> Map.get(:vehicles) |> List.first()

    assert first_vehicle |> Map.get(:end_address) == %{lat: 61.829182, lon: 16.0896213}
  end

  test "vehicle with end_address defined" do
    MessageGenerator.random_car(%{
      start_address: %{lat: 61.829182, lon: 16.0896213},
      end_address: %{lat: 51.829182, lon: 17.0896213}
    })
    |> Vehicle.make()

    MessageGenerator.random_booking()
    |> Booking.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()
    booking_ids = Engine.BookingStore.get_bookings()
    Engine.BookingProcessor.calculate_plan(vehicle_ids, booking_ids)
    plan = PlanStore.get_plan()

    clear_state()

    first_vehicle = plan |> Map.get(:vehicles) |> List.first()

    assert first_vehicle |> Map.get(:end_address) == %{lat: 51.829182, lon: 17.0896213}
  end

  test "time window constrains is passed on from vehicle to plan" do
    now = DateTime.utc_now()
    later = now |> DateTime.add(60 * 60 * 6)
    {:ok, earliest_start} = Engine.Cldr.DateTime.to_string(now, format: "HH:mm")
    {:ok, latest_end} = Engine.Cldr.DateTime.to_string(later, format: "HH:mm")

    MessageGenerator.random_car(%{earliest_start: earliest_start, latest_end: latest_end})
    |> Vehicle.make()

    MessageGenerator.random_booking()
    |> Booking.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()
    booking_ids = Engine.BookingStore.get_bookings()
    Engine.BookingProcessor.calculate_plan(vehicle_ids, booking_ids)
    plan = PlanStore.get_plan()

    clear_state()

    first_vehicle = plan |> Map.get(:vehicles) |> List.first()

    assert first_vehicle |> Map.get(:earliest_start) ==
             earliest_start

    assert first_vehicle |> Map.get(:latest_end) ==
             latest_end
  end

  test "capacity is included in the plan" do
    MessageGenerator.random_car(%{
      capacity: %{weight: 731, volume: 18}
    })
    |> Vehicle.make()

    MessageGenerator.random_booking(%{
      size: %{measurements: [14, 12, 10], weight: 1}
    })
    |> Booking.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()
    booking_ids = Engine.BookingStore.get_bookings()
    Engine.BookingProcessor.calculate_plan(vehicle_ids, booking_ids)
    plan = PlanStore.get_plan()

    clear_state()

    first_vehicle = plan |> Map.get(:vehicles) |> List.first()

    assert first_vehicle |> Map.get(:capacity) == %{weight: 731, volume: 18}
  end

  test "vehicle with too small storage doesn't get assigned" do
    MessageGenerator.random_car(%{
      capacity: %{weight: 700, volume: 1}
    })
    |> Vehicle.make()

    MessageGenerator.random_booking(%{
      size: %{measurements: [100, 100, 101], weight: 2}
    })
    |> Booking.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()
    booking_ids = Engine.BookingStore.get_bookings()
    Engine.BookingProcessor.calculate_plan(vehicle_ids, booking_ids)
    plan = PlanStore.get_plan()
    clear_state()

    assert plan |> Map.get(:vehicles) |> length() == 0
  end

  test "vehicle with too little weight capabilities doesn't get assigned" do
    MessageGenerator.random_car(%{
      capacity: %{weight: 50, volume: 18}
    })
    |> Vehicle.make()

    MessageGenerator.random_booking(%{
      size: %{measurements: [14, 12, 10], weight: 100}
    })
    |> Booking.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()
    booking_ids = Engine.BookingStore.get_bookings()
    Engine.BookingProcessor.calculate_plan(vehicle_ids, booking_ids)
    plan = PlanStore.get_plan()
    clear_state()

    assert plan |> Map.get(:vehicles) |> length() == 0
  end

  test "bookings with same pickup should work just fine" do
    MessageGenerator.random_booking(%{
      pickup: %{lat: 61.829182, lon: 16.0896213}
    })
    |> Booking.make()

    MessageGenerator.random_booking(%{
      pickup: %{lat: 61.829182, lon: 16.0896213}
    })
    |> Booking.make()

    MessageGenerator.random_booking(%{
      delivery: %{lat: 61.829182, lon: 16.0896213}
    })
    |> Booking.make()

    MessageGenerator.random_car(%{start_address: %{lat: 60.1111, lon: 16.07544}})
    |> Vehicle.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()
    booking_ids = Engine.BookingStore.get_bookings()
    Engine.BookingProcessor.calculate_plan(vehicle_ids, booking_ids)
    plan = PlanStore.get_plan()
    clear_state()

    assert Map.get(plan, :vehicles) |> length() == 1
    assert Map.get(plan, :booking_ids) |> length() == 3
  end
end
