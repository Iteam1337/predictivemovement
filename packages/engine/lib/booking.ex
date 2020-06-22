defmodule Booking do
  use GenServer

  defstruct [:id, :pickup, :delivery, :assigned_to, :senderId, :external_id, :events]

  def make(pickup, delivery, external_id, senderId) do
    id = external_id

    GenServer.start_link(
      __MODULE__,
      %Booking{
        id: id,
        external_id: external_id,
        pickup: pickup,
        delivery: delivery,
        senderId: senderId,
        events: []
      },
      name: via_tuple(id)
    )

    id
  end

  def get(id) do
    GenServer.call(via_tuple(id), :get)
  end

  # def assign(%Booking{pickup: pickup, delivery: delivery} = booking) do
  def assign(booking_id, vehicle_id) do
    GenServer.call(via_tuple(booking_id), {:assign, vehicle_id})
  end

  defp via_tuple(id) when is_integer(id), do: via_tuple(Integer.to_string(id))

  defp via_tuple(id) when is_binary(id) do
    {:via, :gproc, {:n, :l, {:booking_id, id}}}
  end

  def init(init_arg) do
    {:ok, init_arg}
  end

  def handle_call(:get, _from, state) do
    {:reply, state, state}
  end

  def handle_call({:assign, vehicle}, _from, state) do
    route = Osrm.route(state.pickup, state.delivery)

    updated_state =
      state
      |> Map.put(:route, route)
      |> Map.put(:assigned_to, %{
        id: vehicle.id,
        metadata: vehicle.metadata,
        route: route
      })
      |> Map.put(:events, [%{timestamp: DateTime.utc_now(), type: :assigned} | state.events])

    updated_state
    |> MQ.publish(
      Application.fetch_env!(:engine, :bookings_exchange),
      "assigned"
    )

    IO.puts("Booking assigned")
    {:reply, true, updated_state}
  end
end
