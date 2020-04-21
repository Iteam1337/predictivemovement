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
          concurrency: 100
        ]
      ]
    )
  end

  def handle_message(_processor, %Broadway.Message{data: {cars, booking}} = msg, _context) do
    IO.inspect({cars, booking}, label: "oh a message")

    cars_sorted_by_score =
      cars
      |> Flow.from_enumerable()
      |> Flow.partition(stages: 50)
      |> Flow.map(fn car -> calculate_score(booking, car) end)
      |> Enum.sort(fn {_, _, score1}, {_, _, score2} -> score1 > score2 end)
      |> Enum.to_list()

    cars_sorted_by_score
    |> Stream.map(&offer/1)
    |> Stream.run()

    Process.sleep(15000)

    IO.puts("done")
    msg
  end

  def calculate_score(booking, car) do
    IO.inspect(car, label: "calculating score...")
    Process.sleep(4000)
    IO.puts("score calculated!")
    {booking, car, :rand.uniform(1000)}
  end

  def offer(offer) do
    IO.inspect(offer, label: "offer to car")
    Process.sleep(30000)
  end
end
