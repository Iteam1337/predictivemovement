defmodule Dispatcher do
  require Logger

  def dispatch_offers() do
    IO.puts("Dispatching!")

    %{vehicles: vehicles} = PlanStore.get_plan()
    Logger.debug(length(vehicles), label: "amount of vehicles to be offered")

    Enum.map(vehicles, &Vehicle.offer/1)
  end
end
