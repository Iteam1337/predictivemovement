defmodule Engine.BookingStore do
  use GenServer

  def start_link(_) do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init(_) do
    {:ok, []}
  end

  def handle_call({:put, new_booking_id}, _from, booking_ids) do
    {:reply, :ok, [new_booking_id |booking_ids]}
  end

  def handle_call(:get, _from, booking_ids) do
    {:reply, booking_ids, booking_ids}
  end

  def put_booking(booking_id) do
    GenServer.call(__MODULE__, {:put, booking_id})
  end

  def get_bookings() do
    GenServer.call(__MODULE__, :get)
  end
end
