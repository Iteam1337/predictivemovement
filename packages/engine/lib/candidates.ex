defmodule Candidates do
  @callback find_optimal_routes(list(), list()) :: map()

  @amqp Application.get_env(:engine, :candidates)
  def find_optimal_routes(cars, bookings) do
    IO.puts("call candidates_request")

    @amqp.call(
      %{vehicles: cars, bookings: bookings},
      "candidates_request",
      "candidates_response"
    )
    |> Poison.decode!(keys: :atoms)
  end
end
