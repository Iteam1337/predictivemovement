defmodule VehicleMock do
  def offer({%Vehicle{id: id} = vehicle, %Booking{} = booking}),
    do: %{vehicle: vehicle, booking: booking, accepted: true}
end
