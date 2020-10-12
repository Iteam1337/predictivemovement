defmodule DriverAcceptedOffer do
  @derive Jason.Encoder
  defstruct [:vehicle_id, :offer]
end
