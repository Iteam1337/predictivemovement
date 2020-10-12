defmodule BookingDeliveryFailed do
  @derive Jason.Encoder
  defstruct [:booking_id, :timestamp]
end
