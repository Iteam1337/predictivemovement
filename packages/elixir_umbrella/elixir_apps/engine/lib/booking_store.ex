defmodule Engine.BookingStore do
  use GenServer

  def start_link(_) do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init(_) do
    {:ok, []}
  end

  def handle_call({:put, new_booking_id}, _from, booking_ids) do
    {:reply, :ok, [new_booking_id | booking_ids]}
  end

  def handle_call(:get, _from, booking_ids) do
    {:reply, booking_ids, booking_ids}
  end

  def handle_call(:clear, _from, _) do
    {:reply, [], []}
  end

  def handle_call({:delete, booking_id}, _from, booking_ids) do
    updated_booking_ids =
      booking_ids
      |> Enum.reject(fn id -> id == booking_id end)

    {:reply, :ok, updated_booking_ids}
  end

  def put_booking(booking_id) do
    GenServer.call(__MODULE__, {:put, booking_id})
  end

  def get_bookings() do
    GenServer.call(__MODULE__, :get)
  end

  def clear() do
    GenServer.call(__MODULE__, :clear)
  end

  def delete_booking(booking_id) do
    GenServer.call(__MODULE__, {:delete, booking_id})
  end
end
