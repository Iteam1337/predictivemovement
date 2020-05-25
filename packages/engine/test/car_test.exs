defmodule CarTest do
  use ExUnit.Case

  test "gets permutations for 1 previous set of instructions" do
    previous_instructions = [%{position: 1}, %{position: 2}]

    permutations =
      Car.get_possible_route_permutations(previous_instructions, %{position: 5}, %{
        position: 6
      })

    expected_permutations = [
      [%{position: 5}, %{position: 6}, %{position: 1}, %{position: 2}],
      [%{position: 5}, %{position: 1}, %{position: 6}, %{position: 2}],
      [%{position: 5}, %{position: 1}, %{position: 2}, %{position: 6}],
      [%{position: 1}, %{position: 5}, %{position: 6}, %{position: 2}],
      [%{position: 1}, %{position: 5}, %{position: 2}, %{position: 6}],
      [%{position: 1}, %{position: 2}, %{position: 5}, %{position: 6}]
    ]

    assert length(permutations) === length(expected_permutations)

    permutations
    |> Enum.all?(fn permutation -> Enum.member?(expected_permutations, permutation) end)
    |> assert()
  end

  test "gets permutations for no previous set of instructions" do
    previous_instructions = []

    permutations =
      Car.get_possible_route_permutations(previous_instructions, %{position: 5}, %{
        position: 6
      })

    expected_permutations = [
      [%{position: 5}, %{position: 6}]
    ]

    assert length(permutations) === length(expected_permutations)

    permutations
    |> Enum.all?(fn permutation -> Enum.member?(expected_permutations, permutation) end)
    |> assert()
  end

  describe "get_score_diff_with_new_booking" do
    test "score is higher when delivery is further away from pickup" do
      pickup = %{lat: 61.824549, lon: 16.064589}
      delivery_far = %{lat: 61.8362339, lon: 16.1018996}
      delivery_close = %{lat: 61.8295033, lon: 16.0869526}
      hub = %{lat: 61.820701, lon: 16.057731}
      car = Car.make(1, hub)

      diff1 =
        Car.get_score_diff_with_new_booking(car, %Booking{pickup: pickup, delivery: delivery_far})

      diff2 =
        Car.get_score_diff_with_new_booking(car, %Booking{
          pickup: pickup,
          delivery: delivery_close
        })

      assert diff1 > diff2
    end

    test "score is higher when pickup is further away from car position" do
      pickup_close = %{lat: 61.824549, lon: 16.064589}
      pickup_far = %{lat: 61.8345958, lon: 16.0566906}
      delivery = %{lat: 61.8362339, lon: 16.1018996}
      hub = %{lat: 61.820701, lon: 16.057731}
      car = Car.make(1, hub)

      diff1 =
        car
        |> Car.get_score_diff_with_new_booking(%Booking{pickup: pickup_far, delivery: delivery})

      diff2 =
        car
        |> Car.get_score_diff_with_new_booking(%Booking{pickup: pickup_close, delivery: delivery})

      assert diff1 > diff2
    end
  end
end
