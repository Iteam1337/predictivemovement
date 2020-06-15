defmodule Dispatcher do
  def dispatch_offers() do
    IO.puts("Dispatching!")

    CandidatesStore.get_candidates()
    |> Enum.map(&Vehicle.offer/1)
    |> IO.inspect(label: "result from offer")

    # |> Enum.each(....Engine.MatchProducer.remove_bookings)
  end
end
