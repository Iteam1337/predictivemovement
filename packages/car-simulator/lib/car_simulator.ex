defmodule CarSimulator do
  use Application
  @center %{lat: 61.829182, lon: 16.0896213}

  def start(_type, _args) do
    children = []

    Cars.simulate(@center, 5)
    |> Stream.map(fn car -> MQ.publish("cars", car) end)
    |> Stream.run()

    Supervisor.start_link(children, strategy: :one_for_one)
  end
end
