defmodule Engine do
  use Application

  defp score(booking, car, detour) do
    %{booking: booking, car: car, score: detour.diff}
  end

  def start(_type, _args) do
    cars = Routes.init() |> Enum.take(5)

    BookingRequests.init()
    |> Stream.flat_map(fn booking ->
      CarFinder.find(booking, cars)
    end)
    |> Stream.map(fn %{booking: booking, car: car, detour: detour} ->
      score(booking, car, detour)
    end)
    |> Stream.map(fn candidates -> MQ.publish("candidates", candidates) end)
    |> Stream.run()

    # candidates
    # |> IO.inspect(label: "Found new candidateç")
    # |> Enum.map(fn booking -> MQ.publish("candidates", booking) end)

    children = []

    Supervisor.start_link(children, strategy: :one_for_one)
  end
end
