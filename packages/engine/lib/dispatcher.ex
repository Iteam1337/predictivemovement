defmodule Dispatcher do
  def dispatch_offers() do
    IO.puts("Dispatching!")

    PlanStore.get_plan()
    |> Enum.map(&Vehicle.offer/1)
    |> IO.inspect(label: "result from offer")

    # |> Enum.each(....Engine.MatchProducer.remove_bookings)
  end
end
