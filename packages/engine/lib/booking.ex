defmodule Booking do
  defstruct [:id, :pickup, :delivery, :assignedVehicle, :senderId]

  def calculate_score(%Vehicle{} = vehicle, %Booking{} = booking) do
    Vehicle.get_score_diff_with_new_booking(vehicle, booking)
  end
end
