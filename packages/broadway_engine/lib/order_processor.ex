defmodule BroadwayEngine.OrderProcessor do
  use Broadway

  def start_link(_opts) do
    Broadway.start_link(__MODULE__,
      name: __MODULE__,
      producer: [
        module: {BroadwayEngine.MatchProducer, []},
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
        %Broadway.Message{acknowledger: acknowledger, data: {cars, bookings}},
        _context
      ) do
    IO.inspect({cars, bookings}, label: "oh a message")

    # cars -> [instructions]
    %{solution: %{routes: routes}} =
      Graphhopper.find_optimal_routes(cars, bookings)
      |> IO.inspect(label: "radu")

    cars =
      routes
      |> Enum.map(fn %{activities: activities, vehicle_id: id} ->
        %Car{instructions: activities, id: id}
      end)

    IO.puts("done")

    %Broadway.Message{
      data: {cars, bookings},
      acknowledger: acknowledger
    }
  end

  def offer(offer) do
    IO.inspect(offer, label: "offer to car")
    # Process.sleep(15000)
    IO.puts("car timed out.. onto the next in line")
  end
end
