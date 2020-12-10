defmodule BookingProcessorTest do
  import TestHelper
  alias MessageGenerator.TransportGenerator
  alias MessageGenerator.BookingGenerator
  import Mox
  def amqp_url, do: "amqp://" <> Application.fetch_env!(:engine, :amqp_host)
  use ExUnit.Case

  setup :clear_state

  @tag :only
  test "creates a plan for one vehicle and one booking" do
    Engine.Adapters.MockRMQ
    |> expect(:publish, fn _, _ ->
      IO.puts("hej")
      {:ok, 30}
    end)

    TransportGenerator.generate_transport_props()
    |> Vehicle.make()

    BookingGenerator.generate_booking_props()
    |> Booking.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()
    booking_ids = Engine.BookingStore.get_bookings()
    Plan.calculate(vehicle_ids, booking_ids)
    plan = PlanStore.get_plan()

    assert Map.get(plan, :booking_ids) |> length() == 1
    assert Map.get(plan, :transports) |> length() == 1
    assert Map.get(plan, :transports) |> List.first() |> Map.get(:earliest_start) == nil
  end

  test "creates a plan where one vehicle gets two bookings and one gets zero" do
    TransportGenerator.generate_transport_props()
    |> TransportGenerator.put_new_transport_addresses_from_city(:stockholm)
    |> Vehicle.make()

    TransportGenerator.generate_transport_props()
    |> TransportGenerator.put_new_transport_addresses_from_city(:gothenburg)
    |> Vehicle.make()

    BookingGenerator.generate_booking_props()
    |> BookingGenerator.put_new_booking_addresses_from_city(:stockholm)
    |> Booking.make()

    BookingGenerator.generate_booking_props()
    |> BookingGenerator.put_new_booking_addresses_from_city(:stockholm)
    |> Booking.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()
    booking_ids = Engine.BookingStore.get_bookings()
    Plan.calculate(vehicle_ids, booking_ids)
    plan = PlanStore.get_plan()

    assert plan |> Map.get(:transports) |> length() == 1
    assert plan |> Map.get(:booking_ids) |> length() == 2
  end

  test "creates a plan for two vehicles, where each vehicle gets one" do
    %{}
    |> TransportGenerator.put_new_transport_addresses_from_city(:stockholm)
    |> TransportGenerator.generate_transport_props()
    |> Vehicle.make()

    %{}
    |> TransportGenerator.put_new_transport_addresses_from_city(:gothenburg)
    |> TransportGenerator.generate_transport_props()
    |> Vehicle.make()

    %{}
    |> BookingGenerator.put_new_booking_addresses_from_city(:stockholm)
    |> BookingGenerator.generate_booking_props()
    |> Booking.make()

    %{}
    |> BookingGenerator.put_new_booking_addresses_from_city(:gothenburg)
    |> BookingGenerator.generate_booking_props()
    |> Booking.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()
    booking_ids = Engine.BookingStore.get_bookings()
    Plan.calculate(vehicle_ids, booking_ids)
    plan = PlanStore.get_plan()

    assert 2 ==
             plan
             |> Map.get(:transports)
             |> length()

    assert plan
           |> Map.get(:transports)
           |> List.first()
           |> Map.get(:booking_ids)
           |> length() == 1
  end

  test "vehicle with no end_address defined gets start_address as end_address" do
    TransportGenerator.generate_transport_props(%{
      start_address: %{lat: 61.829182, lon: 16.0896213}
    })
    |> Vehicle.make()

    BookingGenerator.generate_booking_props()
    |> Booking.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()
    booking_ids = Engine.BookingStore.get_bookings()
    Plan.calculate(vehicle_ids, booking_ids)
    plan = PlanStore.get_plan()

    first_vehicle = plan |> Map.get(:transports) |> List.first()
    assert first_vehicle |> Map.get(:end_address) == %{lat: 61.829182, lon: 16.0896213}
  end

  test "vehicle with end_address defined" do
    TransportGenerator.generate_transport_props(%{
      start_address: %{lat: 61.829182, lon: 16.0896213},
      end_address: %{lat: 51.829182, lon: 17.0896213}
    })
    |> Vehicle.make()

    BookingGenerator.generate_booking_props()
    |> Booking.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()
    booking_ids = Engine.BookingStore.get_bookings()
    Plan.calculate(vehicle_ids, booking_ids)
    plan = PlanStore.get_plan()

    first_vehicle = plan |> Map.get(:transports) |> List.first()
    assert first_vehicle |> Map.get(:end_address) == %{lat: 51.829182, lon: 17.0896213}
  end

  test "time window constrains is passed on from vehicle to plan" do
    earliest_start =
      Time.utc_now() |> Time.add(60 * 60 * -3) |> Time.to_string() |> String.slice(0..4)

    latest_end = Time.utc_now() |> Time.add(60 * 60 * 3) |> Time.to_string() |> String.slice(0..4)

    TransportGenerator.generate_transport_props(%{
      earliest_start: earliest_start,
      latest_end: latest_end
    })
    |> Vehicle.make()

    BookingGenerator.generate_booking_props()
    |> Booking.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()
    booking_ids = Engine.BookingStore.get_bookings()
    Plan.calculate(vehicle_ids, booking_ids)
    plan = PlanStore.get_plan()

    first_vehicle = plan |> Map.get(:transports) |> List.first()

    assert first_vehicle |> Map.get(:earliest_start) ==
             earliest_start

    assert first_vehicle |> Map.get(:latest_end) ==
             latest_end
  end

  test "capacity is included in the plan" do
    TransportGenerator.generate_transport_props(%{
      capacity: %{weight: 731, volume: 18}
    })
    |> Vehicle.make()

    BookingGenerator.generate_booking_props(%{
      size: %{measurements: [14, 12, 10], weight: 1}
    })
    |> Booking.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()
    booking_ids = Engine.BookingStore.get_bookings()
    Plan.calculate(vehicle_ids, booking_ids)
    plan = PlanStore.get_plan()

    first_vehicle = plan |> Map.get(:transports) |> List.first()
    assert first_vehicle |> Map.get(:capacity) == %{weight: 731, volume: 18}
  end

  test "vehicle with too small storage doesn't get assigned" do
    TransportGenerator.generate_transport_props(%{
      capacity: %{weight: 700, volume: 1}
    })
    |> Vehicle.make()

    BookingGenerator.generate_booking_props(%{
      size: %{measurements: [100, 100, 101], weight: 2}
    })
    |> Booking.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()
    booking_ids = Engine.BookingStore.get_bookings()
    Plan.calculate(vehicle_ids, booking_ids)
    plan = PlanStore.get_plan()

    assert plan |> Map.get(:transports) |> length() == 0
  end

  test "vehicle with too little weight capabilities doesn't get assigned" do
    TransportGenerator.generate_transport_props(%{
      capacity: %{weight: 50, volume: 18}
    })
    |> Vehicle.make()

    BookingGenerator.generate_booking_props(%{
      size: %{measurements: [14, 12, 10], weight: 100}
    })
    |> Booking.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()
    booking_ids = Engine.BookingStore.get_bookings()
    Plan.calculate(vehicle_ids, booking_ids)
    plan = PlanStore.get_plan()

    assert plan |> Map.get(:transports) |> length() == 0
  end

  test "bookings with same pickup should work just fine" do
    BookingGenerator.generate_booking_props(%{
      pickup: %{lat: 61.829182, lon: 16.0896213}
    })
    |> Booking.make()

    BookingGenerator.generate_booking_props(%{
      pickup: %{lat: 61.829182, lon: 16.0896213}
    })
    |> Booking.make()

    BookingGenerator.generate_booking_props(%{
      delivery: %{lat: 61.829182, lon: 16.0896213}
    })
    |> Booking.make()

    TransportGenerator.generate_transport_props(%{start_address: %{lat: 60.1111, lon: 16.07544}})
    |> Vehicle.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()
    booking_ids = Engine.BookingStore.get_bookings()
    Plan.calculate(vehicle_ids, booking_ids)
    plan = PlanStore.get_plan()

    assert Map.get(plan, :transports) |> length() == 1
    assert Map.get(plan, :booking_ids) |> length() == 3
  end

  test "constraints failures leads to excluded bookings" do
    expected_id =
      BookingGenerator.generate_booking_props(%{
        id: "Gammelstad->LTU",
        metadata: %{
          start: "Gammelstad (65.641574, 22.015858) -> LTU (65.61582, 22.13488)"
        }
      })
      |> Map.put(:pickup, %{
        lon: 22.015858,
        lat: 65.641574,
        time_windows: [
          %{
            earliest: ~U[1979-08-01 10:00:00.000Z],
            latest: ~U[1979-08-01 11:00:00.000Z]
          }
        ]
      })
      |> Map.put(
        :delivery,
        %{
          lon: 22.13488,
          lat: 65.61582
        }
      )
      |> Booking.make()

    BookingGenerator.generate_booking_props(%{
      id: "Gäddvik->LTU",
      metadata: %{
        start: "Gäddvik (65.581598, 22.051736) -> LTU (65.61582, 22.13488)"
      }
    })
    |> Map.put(:pickup, %{
      lon: 22.051736,
      lat: 65.581598
    })
    |> Map.put(
      :delivery,
      %{
        lon: 22.13488,
        lat: 65.61582
      }
    )
    |> Booking.make()

    TransportGenerator.generate_transport_props(%{
      id: "vehicle-1",
      start_address: %{
        lon: 21.92567,
        lat: 65.6335
      },
      end_address: %{
        lon: 21.92567,
        lat: 65.6335
      },
      metadata: %{
        start: "Bällinge (65.6335,21.92567)"
      }
    })
    |> Vehicle.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()
    booking_ids = Engine.BookingStore.get_bookings()
    Plan.calculate(vehicle_ids, booking_ids)
    plan = PlanStore.get_plan()

    assert Map.get(plan, :transports) |> length() == 1
    assert Map.get(plan, :excluded_booking_ids) |> length() == 1

    assert Map.get(plan, :excluded_booking_ids) |> List.first() |> Map.get(:id) ==
             expected_id
  end
end
