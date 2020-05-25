defmodule Car do
  defstruct id: 0,
            position: %{lon: 53, lat: 14},
            heading: nil,
            busy: false,
            instructions: [],
            orsm_route: nil

  def make(id, position, busy \\ false) do
    %Car{id: id, position: position, busy: busy}
  end

  def get_score_diff_with_new_booking(
        %Car{instructions: [], position: car_position} = car,
        %Booking{
          pickup: pickup,
          delivery: delivery
        }
      ),
      do:
        {Map.put(car, :instructions, [pickup, delivery]),
         get_osrm_distance([car_position, pickup, delivery, car_position])}

  def get_score_diff_with_new_booking(
        %Car{instructions: old_instructions, position: _car_position} = car,
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

    {Map.put(car, :instructions, new_instructions), old_score - new_score}
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
end
