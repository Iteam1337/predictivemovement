defmodule Dispatcher do
  require Logger

  defp offer_to_vehicles(vehicles) when length(vehicles) == 0, do: IO.puts("No vehicles to offer a plan to")

  defp offer_to_vehicles(vehicles) do
    Enum.map(vehicles, &Vehicle.offer/1)
  end

  def dispatch_offers() do
    IO.puts("Dispatching!")

    %{ vehicles: vehicles } = PlanStore.get_plan()
    Logger.debug(length(vehicles), label: "amount of vehicles to be offered")
    offer_to_vehicles(vehicles)
  end
end
