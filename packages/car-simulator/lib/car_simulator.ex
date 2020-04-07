defmodule CarSimulator.App do
  use GenServer, restart: :permanent

  @center %{lat: 61.829182, lon: 16.0896213}

  def start_link(opts \\ [name: __MODULE__]) do
    GenServer.start_link(__MODULE__, nil, opts)
  end

  def init(_opts) do
    start_simulation()
    {:ok, nil}
  end

  # Public interface
  def start_simulation() do
    IO.puts("started simulation")

    Cars.simulate(@center, 5)
    |> Stream.map(fn car ->
      MQ.publish(Application.fetch_env!(:car_simulator, :exchange), car)
    end)
    |> Stream.run()
  end
end
