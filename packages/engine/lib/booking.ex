defmodule Booking do
  defstruct [:id, :pickup, :delivery, :assignedVehicle, :senderId]

  def calculate_score(%Vehicle{} = vehicle, %Booking{} = booking) do
    Vehicle.get_score_diff_with_new_booking(vehicle, booking)
  end

  def assign(%{booking: booking, vehicle: vehicle}) do
    MQ.publish(
      %{booking: booking, car: vehicle},
      Application.fetch_env!(:engine, :bookings_exchange),
      "assigned"
    )
  end
end
