defmodule Dispatcher do
  def dispatch_offers() do
    IO.puts("Dispatching!")

    PlanStore.get_plan()
    |> (fn vehicles ->
          IO.inspect(length(vehicles), label: "amount of vehicles to be offered")
          vehicles
        end).()
    |> Enum.map(&Vehicle.offer/1)

    # |> Enum.each(....Engine.MatchProducer.remove_bookings)
  end
end
