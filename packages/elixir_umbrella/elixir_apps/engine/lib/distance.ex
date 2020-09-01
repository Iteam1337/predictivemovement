defmodule Distance do
  def calculate_distance([start_route | rest]) do
    [end_route | booking_activities] = Enum.reverse(rest)

    number_of_bookings =
      booking_activities
      |> Enum.group_by(fn %{id: id} -> id end)
      |> Map.keys()
      |> length

    calculate_distance(
      booking_activities,
      (start_route.distance + end_route.distance) / number_of_bookings
    )
  end

  def calculate_distance(booking_activities, shared_cost_per_booking) do
    booking_activities
    |> Enum.reduce(%{}, fn %{
                             distance: distance,
                             id: id
                           },
                           acc ->
      acc
      |> Map.put(
        String.to_atom(id),
        (Map.get(acc, String.to_atom(id)) || 0) + distance
      )
    end)
    |> Enum.reduce(%{}, fn {id, specific}, acc ->
      acc
      |> Map.put(
        id,
        %{specific: specific, shared: shared_cost_per_booking}
      )
    end)
  end
end
