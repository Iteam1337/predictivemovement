defmodule BookingSimulatorTest do
  use ExUnit.Case
  doctest BookingSimulator

  test "greets the world" do
    assert BookingSimulator.hello() == :world
  end
end
