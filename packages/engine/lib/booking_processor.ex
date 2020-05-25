defmodule Engine.BookingProcessor do
  use Broadway

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
      Graphhopper.find_optimal_routes(vehicles, bookings)
      |> IO.inspect(label: "optimal routes")

    vehicles =
      routes
      |> Enum.map(fn %{activities: activities, vehicle_id: id} ->
        %Vehicle{instructions: activities, id: id}
      end)

    vehicles
    |> Enum.zip(bookings)
    |> Enum.each(&offer/1)

    %Broadway.Message{
      data: {vehicles, bookings},
      acknowledger: acknowledger
    }
  end

  def offer({%Vehicle{id: id} = vehicle, %Booking{} = booking}) do
    IO.inspect(vehicle, label: "offer to vehicle")
    accepted = AMQP.call(%{vehicle: %{id: id}, booking: booking})

    IO.puts("Did the vehicle accept? The answer is #{accepted}")
  end
end
