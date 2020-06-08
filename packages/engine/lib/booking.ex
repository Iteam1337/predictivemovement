defmodule Booking do
  defstruct [:id, :pickup, :delivery, :assigned_to, :senderId]

  def assign(%Booking{} = booking) do
    MQ.publish(
      booking,
      Application.fetch_env!(:engine, :bookings_exchange),
      "assigned"
    )
  end
end
