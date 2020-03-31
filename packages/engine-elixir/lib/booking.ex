defmodule Booking do
  defstruct id: 0,
            departure: nil,
            destination: nil,
            assignedCar: nil

  def make(id), do: make(id, nil, nil)

  def make(id, departure, destination) do
    %Booking{id: id, departure: departure, destination: destination}
  end
end
