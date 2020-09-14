defmodule Engine.VehicleStore do
  use GenServer

  def start_link(_) do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init(_) do
    {:ok, []}
  end

  def handle_call({:put, new_vehicle_id}, _from, vehicle_ids) do
    {:reply, :ok, [new_vehicle_id |vehicle_ids]}
  end

  def handle_call(:get, _from, vehicle_ids) do
    {:reply, vehicle_ids, vehicle_ids}
  end

  def handle_call(:clear, _from, _) do
    {:reply, [], []}
  end

  def put_vehicle(vehicle_id) do
    GenServer.call(__MODULE__, {:put, vehicle_id})
  end

  def get_vehicles() do
    GenServer.call(__MODULE__, :get)
  end

  def clear() do
    GenServer.call(__MODULE__, :clear)
  end
end
