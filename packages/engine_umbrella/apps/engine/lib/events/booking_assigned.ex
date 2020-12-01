defmodule BookingAssigned do
  @derive Jason.Encoder
  defstruct [:booking_id, :vehicle_id, :timestamp]
end
