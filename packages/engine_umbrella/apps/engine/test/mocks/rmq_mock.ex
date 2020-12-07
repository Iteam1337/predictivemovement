defmodule Engine.Adapters.MockRMQ do
  @behaviour Engine.Behaviours.QueuePublisher

  def publish(_, _, _) do
    IO.puts("test1")
  end

  def publish(_, _) do
    IO.puts("test2")
  end
end
