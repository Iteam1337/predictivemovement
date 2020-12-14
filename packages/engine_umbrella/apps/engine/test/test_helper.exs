Logger.configure(level: :none)
ExUnit.start()

defmodule TestHelper do
  Mox.defmock(Engine.Adapters.MockRMQ, for: Engine.Behaviours.QueuePublisher)

  def clear_state(_context) do
    Engine.VehicleStore.clear()
    Engine.BookingStore.clear()
  end
end
