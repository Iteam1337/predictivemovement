defmodule Booking do
  def calculate_score(%Car{} = car, %Order{} = order) do
    Car.get_score_diff_with_new_order(car, order)
  end
end
