defmodule Engine.BookingProcessor do
  use Broadway

  @candidates Application.get_env(:engine, :candidates)

  def start_link(_opts) do
    Broadway.start_link(__MODULE__,
      name: __MODULE__,
      producer: [
        module: {Engine.MatchProducer, []},
        concurrency: 1
      ],
      processors: [
        default: [
          concurrency: 1
        ]
      ]
    )
  end

  def handle_message(
        _processor,
        %Broadway.Message{acknowledger: acknowledger, data: {vehicle_ids, booking_ids}},
        _context
      ) do
    IO.inspect({vehicle_ids, booking_ids}, label: "oh a message")

    %{solution: %{routes: routes}} =
      @candidates.find_optimal_routes(vehicle_ids, booking_ids)
      |> IO.inspect(label: "optimal routes")

    routes
    |> Enum.map(fn %{activities: activities, vehicle_id: id} ->
      booking_ids =
        activities |> Enum.filter(&Map.has_key?(&1, :id)) |> Enum.map(& &1.id) |> Enum.uniq()

      Vehicle.get(id)
      |> Map.put(:activities, activities)
      |> Map.put(:booking_ids, booking_ids)
    end)
    |> CandidatesStore.put_candidates()

    %Broadway.Message{
      data: {vehicle_ids, booking_ids},
      acknowledger: acknowledger
    }
  end
end
