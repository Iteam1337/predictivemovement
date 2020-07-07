defmodule Plan do
  @behaviour PlanBehaviour

  def find_optimal_routes(vehicle_ids, booking_ids) do
    IO.puts("call route_optimization_jsprit")

    %{}
    |> Map.put(:vehicles, Enum.map(vehicle_ids, &Vehicle.get/1))
    |> Map.put(:bookings, Enum.map(booking_ids, &Booking.get/1))
    |> Plan.insert_time_matrix()
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
  end
end
