defmodule Engine.Health do
  @moduledoc """
  Check various health attributes of the application
  """

  def is_alive? do
    {:ok, _} = Engine.Adapters.RMQ.get_connection()
    true
  rescue
    e ->
      false
  end
end
