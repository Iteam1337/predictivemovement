defmodule BookingSimulator do
  use Application
  @center %{lat: 61.829182, lon: 16.0896213}

  def start(_type, _args) do
    children = []

    Bookings.simulate(@center, 1)
    |> Stream.map(fn booking ->
      MQ.publish(Application.fetch_env!(:booking_simulator, :queue), booking)
    end)
    |> Stream.run()

    Supervisor.start_link(children, strategy: :one_for_one)
  end
end
