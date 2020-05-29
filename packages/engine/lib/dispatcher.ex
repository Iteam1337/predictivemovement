defmodule Dispatcher do
  def dispatch_offers() do
    CandidatesStore.get_candidates()
    |> Enum.map(&Vehicle.offer/1)

    # |> Enum.each(....Engine.MatchProducer.remove_bookings)
  end
end
