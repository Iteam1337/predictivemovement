defmodule VehicleMock do
  def offer({%Vehicle{id: "tesla"} = vehicle, %Booking{} = booking}),
    do: %{vehicle: vehicle, booking: booking, accepted: true}

  def offer({%Vehicle{id: "volvo"} = vehicle, %Booking{} = booking}),
    do: %{vehicle: vehicle, booking: booking, accepted: false}

  def offer({%Vehicle{id: id} = vehicle, %Booking{} = booking}),
    do: %{vehicle: vehicle, booking: booking, accepted: true}
end
