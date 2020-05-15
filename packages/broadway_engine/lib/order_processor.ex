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

  def message_to_car_transform(message) do
    message
    |> Poison.decode!(%{keys: :atoms!})
    |> Map.get(:position)
    |> (fn position -> Car.make(1, position) end).()
  end

  def message_to_order_transform(message) do
    decoded = Poison.decode!(message, %{keys: :atoms})

    %Order{}
    |> Map.put(:pickup, decoded.departure)
    |> Map.put(:dropoff, decoded.destination)
  end

  def handle_message(_processor, %Broadway.Message{data: {cars, order_message}} = msg, _context) do
    IO.inspect({cars, order_message}, label: "oh a message")
    %{"id" => order_id} = Poison.decode!(order_message)
    IO.inspect(order_id, label: "order with ID")

    cars_sorted_by_score =
      cars
      |> Flow.from_enumerable()
      |> Flow.partition(stages: 50)
      |> Flow.map(&message_to_car_transform/1)
      |> Flow.map(fn car ->
        Booking.calculate_score(car, order_message |> message_to_order_transform)
      end)
      |> Enum.sort(fn {_, score1}, {_, score2} -> score1 > score2 end)
      |> Enum.to_list()

    IO.inspect(order_id, label: "making offer on order")

    cars_sorted_by_score
    |> Stream.map(&offer/1)
    |> Stream.run()

    IO.puts("done")
    msg
  end

  def offer(offer) do
    IO.inspect(offer, label: "offer to car")
    Process.sleep(15000)
    IO.puts("car timed out.. onto the next in line")
  end
end
