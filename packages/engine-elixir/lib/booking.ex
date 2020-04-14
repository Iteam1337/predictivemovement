defmodule Booking do
  defstruct id: 0,
            departure: nil,
            destination: nil,
            assignedCar: nil

  def make(id), do: make(id, nil, nil)

  def make(id, departure, destination) do
    %Booking{id: id, departure: departure, destination: destination}
  end

  def assign(booking, car) do
    MQ.publish(
      %{booking: booking, car: car},
      Application.fetch_env!(:engine, :booking_assignments_queue)
    )

    MQ.publish(
      %{booking: booking, car: car},
      Application.fetch_env!(:engine, :pickup_instructions_queue)
    )
  end

  # def waitUntilPickup(booking) do
  #   MQ.subscribe()
  # end
end
