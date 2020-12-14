defmodule PlanStore do
  use GenServer
  import Logger
  alias Engine.Adapters.RMQ
  @outgoing_plan_exchange Application.compile_env!(:engine, :outgoing_plan_exchange)

  def start_link(_) do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init(_) do
    {:ok, %{transports: []}}
  end

  def handle_call({:put, new_plan}, _from, _state), do: {:reply, new_plan, new_plan}

  def handle_call(:get, _from, state) do
    {:reply, state, state}
  end

  def put_plan(plan) do
    Logger.info("publishing new plan")

    GenServer.call(__MODULE__, {:put, plan})
    |> Map.update!(:transports, fn transport -> Enum.map(transport, &Map.from_struct/1) end)
    |> RMQ.publish(@outgoing_plan_exchange)
  end

  def get_plan() do
    GenServer.call(__MODULE__, :get)
  end
end
