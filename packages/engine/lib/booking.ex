defmodule Booking do
  defstruct [:id, :pickup, :delivery, :assigned_to, :senderId]

  def calculate_score(%Vehicle{} = vehicle, %Booking{} = booking) do
    Vehicle.get_score_diff_with_new_booking(vehicle, booking)
  end

  def assign(%Booking{} = booking) do
    MQ.publish(
      booking,
      Application.fetch_env!(:engine, :bookings_exchange),
      "assigned"
    )
  end
end
