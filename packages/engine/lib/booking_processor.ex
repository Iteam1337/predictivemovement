defmodule Engine.BookingProcessor do
  use Broadway

  @candidates Application.get_env(:engine, :candidates)
  @vehicle Application.get_env(:engine, :vehicle)

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
        %Broadway.Message{acknowledger: acknowledger, data: {vehicles, bookings}},
        _context
      ) do
    IO.inspect({vehicles, bookings}, label: "oh a message")
    # vehicles -> [instructions]
    %{solution: %{routes: routes}} =
      @candidates.find_optimal_routes(vehicles, bookings)
      |> IO.inspect(label: "optimal routes")

    vehicles =
      routes
      |> Enum.map(fn %{activities: activities, vehicle_id: id} ->
        %Vehicle{instructions: activities, id: id}
      end)

    vehicles
    |> Enum.zip(bookings)
    |> Enum.each(&CandidatesStore.put_candidates/1)

    %Broadway.Message{
      data: {vehicles, bookings},
      acknowledger: acknowledger
    }
  end
end
