defmodule Engine.BookingProcessor do
  use Broadway
  alias Broadway.Message
  require Logger
  @plan Application.get_env(:engine, :plan)
  @jsprit_time_constraint_msg "Time of time window constraint is in the past!"

  def start_link(_opts) do
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

  defp handle_booking_failure(%{id: id, failure: %{status_msg: @jsprit_time_constraint_msg}}),
    do: %{id: id, status: "TIME_CONSTRAINTS_EXPIRED"}

  defp handle_booking_failure(%{id: id}), do: %{id: id, status: "CONSTRAINTS_FAILURE"}

  def calculate_plan(vehicle_ids, booking_ids)
      when length(vehicle_ids) == 0 or length(booking_ids) == 0,
      do: IO.puts("No vehicles/bookings to calculate plan for")

  def calculate_plan(vehicle_ids, booking_ids) do
    %{data: %{solution: %{routes: routes, excluded: excluded}}} =
      @plan.find_optimal_routes(vehicle_ids, booking_ids)

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

    PlanStore.put_plan(%{
      vehicles: vehicles,
      booking_ids: booking_ids,
      excluded_booking_ids: Enum.map(excluded, &handle_booking_failure/1)
    })
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
    id =
      booking
      |> string_to_booking_transform()
      |> IO.inspect(label: "a new booking")
      |> Booking.make()

    Logger.info("Booking with id: #{id} created")

    msg
  end

  def handle_message(
        _processor,
        %Message{data: %{vehicle: vehicle}} = msg,
        _context
      ) do
    id =
      vehicle
      |> string_to_vehicle_transform()
      |> IO.inspect(label: "creating a new vehicle")
      |> Vehicle.make()

    Logger.info("Vehicle with id: #{id} created")
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

  defp string_to_vehicle_transform(vehicle_string) do
    vehicle_string
    |> Jason.decode!(keys: :atoms)
    |> Map.delete(:id)
  end

  defp string_to_booking_transform(booking_string) do
    Jason.decode!(booking_string, keys: :atoms)
    |> Map.put_new(:metadata, %{})
    |> Map.put_new(:size, nil)
  end
end
