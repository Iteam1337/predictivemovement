defmodule Engine.BookingProcessor do
  use Broadway
  alias Broadway.Message
  @plan Application.get_env(:engine, :plan)

  def start_link(_opts) do
    MQ.init()

    Broadway.start_link(__MODULE__,
      name: __MODULE__,
      producer: [
        module: {Engine.MatchProducer, []},
        concurrency: 1
      ],
      processors: [
        default: [
          concurrency: 100
        ]
      ]
    )
  end

  def calculate_plan() do
    booking_ids = Engine.BookingStore.get_bookings()
    vehicle_ids = Engine.VehicleStore.get_vehicles()

    %{solution: %{routes: routes}} = @plan.find_optimal_routes(vehicle_ids, booking_ids)
    # |> IO.inspect(label: "optimal routes")

    vehicles =
      routes
      |> Enum.map(fn %{activities: activities, vehicle_id: id} ->
        booking_ids =
          activities |> Enum.filter(&Map.has_key?(&1, :id)) |> Enum.map(& &1.id) |> Enum.uniq()

        Vehicle.get(id)
        |> Map.put(:activities, activities)
        |> Map.put(:booking_ids, booking_ids)
      end)
      |> Enum.map(fn vehicle ->
        vehicle
        |> Map.put(
          :current_route,
          vehicle.activities
          |> Enum.map(fn %{address: address} -> address end)
          |> Osrm.route()
        )
      end)

    PlanStore.put_plan(%{vehicles: vehicles, booking_ids: booking_ids})
  end

  def handle_message(
        _processor,
        %Broadway.Message{acknowledger: acknowledger, data: %{booking: booking}},
        _context
      ) do
    IO.inspect(booking, label: "a new booking")


    calculate_plan()

    %Broadway.Message{
      data: %{booking: booking},
      acknowledger: acknowledger
    }
  end

  def handle_message(
        _processor,
        %Broadway.Message{acknowledger: acknowledger, data: %{vehicle: vehicle}},
        _context
      ) do
    IO.inspect(vehicle, label: "a new vehicle")

    calculate_plan()

    %Broadway.Message{
      data: %{vehicle: vehicle},
      acknowledger: acknowledger
    }
  end
end
