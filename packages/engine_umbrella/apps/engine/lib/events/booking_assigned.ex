defmodule BookingAssigned do
  @derive Jason.Encoder
  defstruct [:booking_id, :vehicle, :time_stamp]
end
