# - Scenario 1:
# Start --100--> Pickup A --300--> Deliver A --200--> End
# Result: Total: 600 ?, A: 100 + 300 ?
# - Scenario 2:
# Start --100--> Pickup A --300--> Deliver A --100--> Pickup B --200--> Deliver B --200--> End
# Result: Total: 800 ?, A: 400 ?, B: 300 or 700 ?
# - Scenario 3:
# Start --100--> Pickup A --200--> Pickup B  --100--> Deliver A --200--> Deliver B --200--> End
# Result: I don't even know

defmodule DistanceTest do
  use ExUnit.Case

  @pickupA %{
    distance: 100,
    id: "A",
    type: "pickupShipment"
  }

  @deliverA %{
    distance: 300,
    id: "A",
    type: "deliverShipment"
  }

  @pickupB %{
    distance: 100,
    id: "B",
    type: "pickupShipment"
  }

  @deliverB %{
    distance: 200,
    id: "B",
    type: "deliverShipment"
  }

  @endRoute %{
    distance: 200,
    type: "end"
  }

  @tag :only
  test "1 booking gets all the cost" do
    activities = [@pickupA, @deliverA, @endRoute]
    result = Distance.calculate_distance(activities)
    expected = %{A: %{specific: 300, shared: 300}}
    assert result == expected
  end

  @tag :only
  test "2 booking share costs" do
    activities = [@pickupA, @deliverA, @pickupB, @deliverB, @endRoute]
    result = Distance.calculate_distance(activities)
    expected = %{A: %{specific: 300, shared: 150}, B: %{specific: 300, shared: 150}}
    assert result == expected
  end
end
