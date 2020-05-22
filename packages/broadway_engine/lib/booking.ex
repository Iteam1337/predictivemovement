defmodule Booking do
  defstruct [:id, :pickup, :delivery, :assignedCar, :senderId]

  def calculate_score(%Car{} = car, %Booking{} = booking) do
    Car.get_score_diff_with_new_booking(car, booking)
  end
end
