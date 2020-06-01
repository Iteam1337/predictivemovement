defmodule Dispatcher do
  def dispatch_offers() do
    CandidatesStore.get_candidates()
    |> Enum.map(&Vehicle.offer/1)
    |> IO.inspect(label: "result from offer")
    |> Enum.flat_map(fn %{accepted_bookings: accepted_bookings} -> accepted_bookings end)
    |> Enum.map(&Booking.assign/1)

    # |> Enum.each(....Engine.MatchProducer.remove_bookings)
  end
end
