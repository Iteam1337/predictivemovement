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
      ],
      batchers: [
        default: [
          batch_size: Application.get_env(:engine, :booking_processor_batch_size),
          batch_timeout: Application.get_env(:engine, :booking_processor_batch_timeout)
        ]
      ]
    )
  end

  def calculate_plan(vehicle_ids, booking_ids)
      when length(vehicle_ids) == 0 or length(booking_ids) == 0,
      do: IO.puts("No vehicles/bookings to calculate plan for")

  def calculate_plan(vehicle_ids, booking_ids) do
    %{data: %{solution: %{routes: routes}}} = @plan.find_optimal_routes(vehicle_ids, booking_ids)

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
        %Message{
          data: %{
            booking: booking
          }
        } = msg,
        _context
      ) do
    IO.inspect(
      booking,
      label: "a new booking"
    )

    Booking.make(booking)
    msg
  end

  def handle_message(
        _processor,
        %Message{data: %{vehicle: vehicle}} = msg,
        _context
      ) do
    IO.inspect(vehicle, label: "a new vehicle")
    vehicle |> Vehicle.make()
    msg
  end

  def handle_batch(
        _batcher,
        messages,
        _batch_info,
        _context
      ) do
    IO.puts("a new batch of data")
    booking_ids = Engine.BookingStore.get_bookings()
    vehicle_ids = Engine.VehicleStore.get_vehicles()

    calculate_plan(vehicle_ids, booking_ids)
    messages
  end
end
