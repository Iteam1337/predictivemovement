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
      do:
        {[pickup, dropoff],
         sum_of_straight_line_distances([car_position, pickup, dropoff, car_position])}

  def get_score_diff_with_new_order(
        %Car{instructions: old_instructions, position: _car_position},
        %Order{pickup: pickup, dropoff: dropoff}
      ) do
    {new_instructions, new_score} =
      old_instructions
      |> get_possible_route_permutations(pickup, dropoff)
      |> Enum.map(fn new_instructions ->
        {new_instructions, sum_of_straight_line_distances(new_instructions)}
      end)
      |> List.first()

    {new_instructions, new_score - sum_of_straight_line_distances(old_instructions)}
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

  defmodule Instructions do
    defstruct [:instruction, :position, :booking_id]
  end

  defp sum_of_straight_line_distances(positions) do
    positions
    |> Enum.chunk_every(2, 1, :discard)
    |> Enum.reduce(0, fn [a, b | _rest], sum -> sum + haversine(a, b) end)
  end

  defp haversine(p1, p2) do
    radius = 6_371_000

    dLat = rad(p2.lat - p1.lat)
    dLong = rad(p2.lon - p1.lon)

    a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) * Math.sin(dLong / 2) *
          Math.sin(dLong / 2)

    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    d = radius * c

    Kernel.round(d)
  end

  defp rad(x) do
    x * Math.pi() / 180
  end
end
