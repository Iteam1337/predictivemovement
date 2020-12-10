defmodule Engine.Adapters.MockRMQ do
  @behaviour Engine.Behaviours.QueuePublisher

  @impl
  def publish(_, _) do
  end

  def publish(_, _, _) do
  end
end
