defmodule CarSimulatorTest do
  use ExUnit.Case
  doctest CarSimulator

  test "greets the world" do
    assert CarSimulator.hello() == :world
  end
end
