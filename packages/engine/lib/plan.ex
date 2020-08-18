defmodule Plan do
  @behaviour PlanBehaviour

  def find_optimal_routes(vehicle_ids, booking_ids) do
    IO.puts("call route_optimization_jsprit")

    %{}
    |> Map.put(:vehicles, Enum.map(vehicle_ids, &Vehicle.get/1))
    |> Map.put(
      :bookings,
      Enum.map(booking_ids, &Booking.get/1)
      |> Enum.filter(fn booking ->
        is_nil(booking.assigned_to)
      end)
    )
    |> Plan.insert_time_matrix()
    |> IO.inspect(label: "this is sent to jsprit")
    |> MQ.call("route_optimization_jsprit")
    |> Poison.decode!(keys: :atoms)
  end

  def insert_time_matrix(%{vehicles: vehicles, bookings: bookings} = items) do
    matrix =
      bookings
      |> Enum.flat_map(fn %{pickup: pickup, delivery: delivery} -> [pickup, delivery] end)
      |> Enum.concat(Enum.map(vehicles, fn %{position: position} -> position end))
      |> Osrm.get_time_between_coordinates()
      |> Map.delete(:code)

    Map.put(items, :matrix, matrix)
    |> add_hints_from_matrix()
  end

  def add_hints_from_matrix(%{bookings: bookings} = map) do
    {booking_hints, vehicle_hints} =
      map
      |> get_in([:matrix, :sources])
      |> Enum.map(fn %{hint: hint} -> hint end)
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
    |> Enum.zip(hints)
    |> Enum.map(fn {vehicle, hint} ->
      Map.update!(vehicle, :position, fn position -> Map.put(position, :hint, hint) end)
    end)
  end
end
