defmodule Booking do
  def calculate_score(%Car{} = car, %Order{
        pickup: pickup,
        dropoff: dropoff
      }) do
    {instructions, score} =
      Car.get_score_diff_with_new_order(car, %{pickup: pickup, dropoff: dropoff})
  end
end
