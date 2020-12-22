defmodule Engine.Behaviours.QueuePublisher do
  @callback publish(map(), binary()) :: integer()
  @callback publish(map(), binary(), binary()) :: integer()
end
