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
        %Broadway.Message{acknowledger: acknowledger, data: {cars, booking}},
        _context
      ) do
    IO.inspect({cars, booking}, label: "oh a message")

    cars_sorted_by_score =
      cars
      |> Flow.from_enumerable()
      |> Flow.partition(stages: 50)
      |> Flow.map(fn car ->
        Booking.calculate_score(car, booking)
      end)
      |> Enum.sort_by(fn {_, score} -> score end, :asc)
      |> Enum.to_list()

    IO.inspect(booking.id, label: "making offer on order")

    cars_sorted_by_score
    |> Stream.map(&offer/1)
    |> Stream.run()

    IO.puts("done")

    %Broadway.Message{
      data: {cars_sorted_by_score, booking},
      acknowledger: acknowledger
    }
  end

  def offer(offer) do
    IO.inspect(offer, label: "offer to car")
    # Process.sleep(15000)
    IO.puts("car timed out.. onto the next in line")
  end
end
