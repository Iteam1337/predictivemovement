defmodule Booking do
  defstruct [:id, :pickup, :delivery, :assigned_to, :senderId]

  def assign(%Booking{} = booking) do
    booking
    |> IO.inspect(label: "assigning booking")
    |> MQ.publish(
      Application.fetch_env!(:engine, :bookings_exchange),
      "assigned"
    )
  end
end
