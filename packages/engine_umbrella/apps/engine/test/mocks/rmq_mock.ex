defmodule Engine.Adapters.MockRMQ do
  @behaviour Engine.Behaviours.QueuePublisher

  @impl
  def publish(_, _) do
  end

  @impl
  def publish(_, _, _) do
  end
end
