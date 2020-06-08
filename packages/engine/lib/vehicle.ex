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

  def get_score_diff_with_new_booking(
        %Vehicle{instructions: [], position: vehicle_position} = vehicle,
        %Booking{
          pickup: pickup,
          delivery: delivery
        }
      ),
      do:
        {Map.put(vehicle, :instructions, [pickup, delivery]),
         get_osrm_distance([vehicle_position, pickup, delivery, vehicle_position])}

  def get_score_diff_with_new_booking(
        %Vehicle{instructions: old_instructions, position: _vehicle_position} = vehicle,
        %Booking{pickup: pickup, delivery: delivery}
      ) do
    old_score = get_osrm_distance(old_instructions)

    {new_instructions, new_score} =
      old_instructions
      |> get_possible_route_permutations(pickup, delivery)
      |> Enum.map(fn new_instructions ->
        {new_instructions, get_osrm_distance(new_instructions)}
      end)
      |> Enum.sort_by(fn {_, score} -> score end, :asc)
      |> List.first()

    {Map.put(vehicle, :instructions, new_instructions), old_score - new_score}
  end

  def get_possible_route_permutations(instructions, pickup, delivery) do
    instructions
    |> get_possible_indices_for_new_instruction()
    |> Enum.map(fn {pickup_index, delivery_index} ->
      instructions
      |> List.insert_at(pickup_index, pickup)
      |> List.insert_at(delivery_index, delivery)
    end)
  end

  defp get_possible_indices_for_new_instruction(list_length),
    do: do_get_indices(0, 1, length(list_length) + 2)

  defp do_get_indices(pickup_index, _, list_length) when pickup_index >= list_length,
    do: []

  defp do_get_indices(pickup_index, delivery_index, list_length)
       when delivery_index == list_length,
       do: do_get_indices(pickup_index + 1, pickup_index + 2, list_length)

  defp do_get_indices(pickup_index, delivery_index, list_length),
    do:
      do_get_indices(pickup_index, delivery_index + 1, list_length)
      |> Enum.concat([{pickup_index, delivery_index}])

  def get_osrm_distance(instructions) do
    Osrm.route(instructions)
    |> Map.get(:distance)
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
