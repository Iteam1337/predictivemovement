defmodule Booking do
  defstruct id: 0,
            departure: nil,
            destination: nil,
            assigned_to: nil

  def make(id), do: make(id, nil, nil, nil)

  def make(id, departure, destination, assigned_to) do
    %Booking{id: id, departure: departure, destination: destination, assigned_to: assigned_to}
  end

  def assign(booking, car) do
    MQ.publish(
      booking |> Map.put(:assigned_to, car),
      Application.fetch_env!(:engine, :bookings_exchange),
      "assigned"
    )
  end

  # def waitUntilPickup(booking) do
  #   MQ.subscribe()
  # end
end
