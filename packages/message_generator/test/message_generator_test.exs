defmodule MessageGeneratorTest do
  use ExUnit.Case
  doctest MessageGenerator

  test "greets the world" do
    assert MessageGenerator.hello() == :world
  end
end
