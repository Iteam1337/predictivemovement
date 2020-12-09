defmodule Plan do
  alias Engine.Adapters.RMQRPCWorker
  @jsprit_time_constraint_msg "Time of time window constraint is in the past!"

  def find_optimal_routes(vehicle_ids, booking_ids) do
    IO.puts("call calculate_route_optimization")

    %{}
    |> Map.put(:vehicles, Enum.map(vehicle_ids, &Vehicle.get/1))
    |> Map.put(
      :bookings,
      Enum.map(booking_ids, &Booking.get/1)
      |> Enum.filter(fn booking ->
        is_nil(booking.assigned_to)
      end)
    )
    |> insert_time_matrix()
    |> RMQRPCWorker.call("calculate_route_optimization")
    |> case do
      {:ok, response} ->
        Jason.decode!(response, keys: :atoms)
        |> get_in([:data, :solution])

      _ ->
        nil
    end
  end

  def insert_time_matrix(%{vehicles: vehicles, bookings: bookings} = items) do
    matrix =
      bookings
      |> Enum.flat_map(fn %{pickup: pickup, delivery: delivery} -> [pickup, delivery] end)
      |> Enum.concat(
        Enum.flat_map(vehicles, fn %{start_address: start_address, end_address: end_address} ->
          [start_address, end_address]
        end)
      )
      |> Osrm.get_time_between_coordinates()
      |> Map.delete(:code)

    Map.put(items, :matrix, matrix)
    |> add_hints_from_matrix()
  end

  defp add_hints_from_matrix(%{bookings: bookings} = map) do
    {booking_hints, vehicle_hints} =
      map
      |> get_in([:matrix, "sources"])
      |> Enum.map(fn %{"hint" => hint} -> hint end)
      |> Enum.split(length(bookings) * 2)

    map
    |> Map.update!(:bookings, fn bookings -> add_booking_hints(bookings, booking_hints) end)
    |> Map.update!(:vehicles, fn vehicles -> add_vehicle_hints(vehicles, vehicle_hints) end)
  end

  defp add_booking_hints(bookings, hints) do
    bookings
    |> Enum.reduce({[], hints}, fn booking, {res, [pickup_hint, delivery_hint | rest_of_hints]} ->
      updated_booking =
        booking
        |> Map.update!(:pickup, fn position -> Map.put(position, :hint, pickup_hint) end)
        |> Map.update!(:delivery, fn position -> Map.put(position, :hint, delivery_hint) end)

      {res ++ [updated_booking], rest_of_hints}
    end)
    |> elem(0)
  end

  def add_vehicle_hints(vehicles, hints) do
    vehicles
    |> Enum.reduce({[], hints}, fn vehicle, {res, hints} ->
      [start_hint, end_hint | rest_of_hints] = hints

      updated_vehicle =
        vehicle
        |> Map.update!(:start_address, fn start_address ->
          Map.put(start_address, :hint, start_hint)
        end)
        |> Map.update!(:end_address, fn end_address ->
          Map.put(end_address, :hint, end_hint)
        end)

      {res ++ [updated_vehicle], rest_of_hints}
    end)
    |> elem(0)
  end

  def calculate(vehicle_ids, booking_ids)
      when length(vehicle_ids) == 0 or length(booking_ids) == 0,
      do: IO.puts("No vehicles/bookings to calculate plan for")

  def calculate(vehicle_ids, booking_ids) do
    %{routes: routes, excluded: excluded} = find_optimal_routes(vehicle_ids, booking_ids)

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
      |> Enum.map(&add_distance_durations/1)

    PlanStore.put_plan(%{
      vehicles: vehicles,
      booking_ids: booking_ids,
      excluded_booking_ids: Enum.map(excluded, &handle_booking_failure/1)
    })
  end

  def add_distance_durations(vehicle) do
    distance_durations =
      vehicle
      |> Map.get(:current_route)
      |> Jason.decode!()
      |> Map.get("legs")
      |> Enum.map(fn legs ->
        legs
        |> Enum.reduce(%{}, fn {key, val}, acc -> Map.put(acc, String.to_atom(key), val) end)
        |> Map.take([:distance, :duration])
      end)
      |> List.insert_at(0, %{distance: 0, duration: 0})

    Map.update!(vehicle, :activities, fn activities ->
      Enum.zip(activities, distance_durations)
      |> Enum.map(fn {activity, distance_duration} -> Map.merge(activity, distance_duration) end)
    end)
  end

  defp handle_booking_failure(%{id: id, failure: %{status_msg: @jsprit_time_constraint_msg}}),
    do: %{id: id, status: "TIME_CONSTRAINTS_EXPIRED"}

  defp handle_booking_failure(%{id: id}), do: %{id: id, status: "CONSTRAINTS_FAILURE"}
end
