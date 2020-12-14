Application.put_env(:engine, Adapters.RMQ, Engine.Adapters.MockRMQ)

Logger.configure(level: :none)
ExUnit.start()

defmodule TestHelper do
  Mox.defmock(Engine.Adapters.MockRMQ, for: Engine.Behaviours.QueuePublisher)

  def clear_state(_context) do
    Engine.VehicleStore.clear()
    Engine.BookingStore.clear()
  end
end
