defmodule Plan do
  @behaviour PlanBehaviour

  def find_optimal_routes(vehicle_ids, booking_ids) do
    IO.puts("call plan_request")

    vehicles =
      vehicle_ids
      |> Enum.map(&Vehicle.get/1)

    bookings = booking_ids |> Enum.map(&Booking.get/1)

    MQ.call(
      %{vehicles: vehicles, bookings: bookings},
      "plan_request"
    )
    |> Poison.decode!(keys: :atoms)
  end
end
