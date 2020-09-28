defmodule PlanStore do
  use GenServer
  @outgoing_plan_exchange Application.compile_env!(:engine, :outgoing_plan_exchange)

  def start_link(_) do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init(_) do
    {:ok, %{ vehicles: []}}
  end

  def handle_call({:put, new_plan}, _from, _state) do
    IO.puts("publishing new plan")
    MQ.publish(new_plan, @outgoing_plan_exchange)
    {:reply, :ok, new_plan}
  end

  def handle_call(:get, _from, state) do
    {:reply, state, state}
  end

  def put_plan(plan) do
    GenServer.call(__MODULE__, {:put, plan})
  end

  def get_plan() do
    GenServer.call(__MODULE__, :get)
  end
end
