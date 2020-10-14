defmodule BookingAssigned do
  @derive Jason.Encoder
  defstruct [:booking_id, :vehicle, :timestamp]
end
