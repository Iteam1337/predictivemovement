defmodule VehicleTest do
  import TestHelper
  def amqp_url, do: "amqp://" <> Application.fetch_env!(:engine, :amqp_host)
  @outgoing_plan_exchange Application.compile_env!(:engine, :outgoing_plan_exchange)
  use ExUnit.Case

  @tag :only
  test "it allows vehicle creation" do
    MessageGenerator.random_car()
    |> Vehicle.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()
    clear_state()
    assert vehicle_ids |> length() == 1
  end

  @tag :only
  test "does not allow malformed time constraints" do
    MessageGenerator.random_car(%{ earliest_start: "foo", latest_end: "bar"})
    |> Vehicle.make()

    vehicle_ids = Engine.VehicleStore.get_vehicles()

    clear_state()
    assert vehicle_ids |> length() == 0
  end
end
