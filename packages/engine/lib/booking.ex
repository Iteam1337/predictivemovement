defmodule Booking do
  defstruct [:id, :pickup, :delivery, :assigned_to, :senderId]

  def assign(%Booking{pickup: pickup, delivery: delivery} = booking) do
    booking
    |> Map.put(:route, Osrm.route(pickup, delivery))
    |> IO.inspect(label: "assigning booking")
    |> MQ.publish(
      Application.fetch_env!(:engine, :bookings_exchange),
      "assigned"
    )
  end
end
