defmodule PlanStore do
  use GenServer
  alias Engine.Adapters.RMQ
  @rmq Application.get_env(:engine, Adapters.RMQ, Engine.Adapters.MockRMQ)
  @outgoing_plan_exchange Application.compile_env!(:engine, :outgoing_plan_exchange)

  def start_link(_) do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init(_) do
    {:ok, %{vehicles: []}}
  end

  def handle_call({:put, new_plan}, _from, _state), do: {:reply, new_plan, new_plan}

  def handle_call(:get, _from, state) do
    {:reply, state, state}
  end

  def put_plan(plan) do
    IO.puts("publishing new plan")

    GenServer.call(__MODULE__, {:put, plan})
    |> @rmq.publish(@outgoing_plan_exchange)
    |> IO.inspect()
  end

  def get_plan() do
    GenServer.call(__MODULE__, :get)
  end
end
