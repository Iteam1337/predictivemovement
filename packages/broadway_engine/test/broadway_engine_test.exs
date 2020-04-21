defmodule BroadwayEngineTest do
  use ExUnit.Case
  doctest BroadwayEngine

  test "greets the world" do
    assert BroadwayEngine.hello() == :world
  end
end
