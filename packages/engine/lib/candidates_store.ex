defmodule CandidatesStore do
  use GenServer

  def start_link(_) do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init(_) do
    {:ok, []}
  end

  def handle_call({:put, new_candidates}, _from, _state) do
    {:reply, :ok, new_candidates}
  end

  def handle_call(:get, _from, state) do
    {:reply, state, state}
  end

  def put_candidates(candidates) do
    GenServer.call(__MODULE__, {:put, candidates})
  end

  def get_candidates() do
    GenServer.call(__MODULE__, :get)
  end
end
