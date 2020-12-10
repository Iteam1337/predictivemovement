defmodule Dispatcher do
  require Logger

  def dispatch_offers() do
    IO.puts("Dispatching!")

    %{transports: vehicles} = PlanStore.get_plan()
    Logger.debug("amount of vehicles to be offered: #{length(vehicles)}")

    Enum.map(vehicles, &Vehicle.offer/1)
  end
end
