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

    cars
    |> Enum.zip(bookings)
    |> Enum.each(&offer/1)

    %Broadway.Message{
      data: {cars, bookings},
      acknowledger: acknowledger
    }
  end

  def offer({%Car{id: id} = car, %Booking{} = booking}) do
    IO.inspect(car, label: "offer to car")
    accepted = AMQP.call(%{car: %{id: id}, booking: booking})

    IO.puts("Did the car accept? The answer is #{accepted}")
  end
end
