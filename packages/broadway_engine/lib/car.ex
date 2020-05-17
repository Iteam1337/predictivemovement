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

  def get_score_diff_with_new_order(%Car{instructions: [], position: car_position}, %Order{
        pickup: pickup,
        dropoff: dropoff
      }),
      do: {[pickup, dropoff], get_osrm_distance([car_position, pickup, dropoff, car_position])}

  def get_score_diff_with_new_order(
        %Car{instructions: old_instructions, position: _car_position},
        %Order{pickup: pickup, dropoff: dropoff}
      ) do
    old_score = get_osrm_distance(old_instructions)

    {new_instructions, new_score} =
      old_instructions
      |> get_possible_route_permutations(pickup, dropoff)
      |> Enum.map(fn new_instructions ->
        {new_instructions, get_osrm_distance(new_instructions)}
      end)
      |> Enum.sort_by(fn {_, score} -> score end, :asc)
      |> List.first()

    {new_instructions, old_score - new_score}
  end

  def get_possible_route_permutations(instructions, pickup, dropoff) do
    instructions
    |> get_possible_indices_for_new_instruction()
    |> Enum.map(fn {pickup_index, dropoff_index} ->
      instructions
      |> List.insert_at(pickup_index, pickup)
      |> List.insert_at(dropoff_index, dropoff)
    end)
  end

  defp get_possible_indices_for_new_instruction(list_length),
    do: do_get_indices(0, 1, length(list_length) + 2)

  defp do_get_indices(pickup_index, _, list_length) when pickup_index >= list_length,
    do: []

  defp do_get_indices(pickup_index, dropoff_index, list_length)
       when dropoff_index == list_length,
       do: do_get_indices(pickup_index + 1, pickup_index + 2, list_length)

  defp do_get_indices(pickup_index, dropoff_index, list_length),
    do:
      do_get_indices(pickup_index, dropoff_index + 1, list_length)
      |> Enum.concat([{pickup_index, dropoff_index}])

  def get_osrm_distance(instructions) do
    Osrm.route(instructions)
    |> Map.get(:distance)
  end
end
