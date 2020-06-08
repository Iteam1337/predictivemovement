defmodule Vehicle do
  defstruct id: 0,
            position: %{lon: 53, lat: 14},
            heading: nil,
            busy: false,
            instructions: [],
            orsm_route: nil,
            booking_ids: []

  def make(id, position, busy \\ false) do
    %Vehicle{id: id, position: position, busy: busy}
  end

  def offer(%Vehicle{id: id, instructions: instructions, booking_ids: booking_ids} = vehicle) do
    IO.inspect(vehicle, label: "offer to vehicle")
    instructions_without_start = Enum.filter(instructions, &Map.has_key?(&1, :id))

    accepted_bookings =
      booking_ids
      |> Enum.map(fn id ->
        Enum.filter(instructions_without_start, fn instruction -> instruction.id == id end)
      end)
      |> IO.inspect(label: "instructions for booking")
      |> Enum.map(fn instructions_for_booking ->
        instruction =
          instructions_for_booking
          |> Enum.map(fn %{address: address, type: type} -> {address, type} end)

        booking =
          Map.new()
          |> Map.put(
            :pickup,
            Enum.find(instruction, fn {_, type} -> type == "pickupShipment" end)
            |> elem(0)
          )
          |> Map.put(
            :delivery,
            Enum.find(instruction, fn {_, type} -> type == "deliverShipment" end)
            |> elem(0)
          )
          |> IO.inspect(label: "booking")

        {:ok, accepted} =
          MQ.call(%{vehicle: %{id: id}, booking: booking}, "pickup_offers", "p_response")
          |> Poison.decode()
          |> IO.inspect(label: "the driver answered")

        %{vehicle: vehicle, booking: booking, accepted: accepted}
      end)
      |> Enum.filter(fn %{accepted: accepted} -> accepted end)

    %{vehicle: vehicle, booking_ids: booking_ids, accepted_bookings: accepted_bookings}
  end
end
