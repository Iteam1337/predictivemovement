defmodule Booking do
  use GenServer
  require Logger
  @outgoing_booking_exchange Application.compile_env!(:engine, :outgoing_booking_exchange)

  defstruct [
    :id,
    :pickup,
    :delivery,
    :assigned_to,
    :external_id,
    :events,
    :metadata,
    :size,
    :route
  ]

  def make(pickup, delivery, external_id, metadata, size) do
    id = "pmb-" <> (Base62UUID.generate() |> String.slice(0, 8))

    booking = %Booking{
      id: id,
      pickup: pickup,
      external_id: external_id,
      delivery: delivery,
      metadata: metadata,
      events: [],
      size: size,
      route: Osrm.route(pickup, delivery)
    }

    Engine.RedisAdapter.add_booking(booking)

    GenServer.start_link(
      __MODULE__,
      booking,
      name: via_tuple(id)
    )

    MQ.publish(
      booking,
      @outgoing_booking_exchange,
      "new"
    )

    Engine.BookingStore.put_booking(id)

    id
  end

  def make(%{} = booking_data) do
    booking = struct(Booking, booking_data)

    GenServer.start_link(
      __MODULE__,
      booking,
      name: via_tuple(booking.id)
    )

    route = Osrm.route(booking.pickup, booking.delivery)

    MQ.publish(
      booking |> Map.put(:route, route),
      Application.fetch_env!(:engine, :outgoing_booking_exchange),
      "new"
    )

    Engine.BookingStore.put_booking(booking.id)

    booking.id
  end

  def get(id) do
    GenServer.call(via_tuple(id), :get)
  end

  def assign(booking_id, vehicle), do: GenServer.call(via_tuple(booking_id), {:assign, vehicle})

  def delete(id) do
    Engine.RedisAdapter.delete_booking(id)
    Engine.BookingStore.delete_booking(id)
    GenServer.stop(via_tuple(id))
  end

  def add_event(booking_id, status) when status in ["picked_up", "delivered"],
    do: GenServer.call(via_tuple(booking_id), {:add_event, status})

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
    updated_state =
      state
      |> Map.put(:assigned_to, %{
        id: vehicle.id,
        metadata: vehicle.metadata
      })
      |> Map.put(:events, [%{timestamp: DateTime.utc_now(), type: :assigned} | state.events])

    updated_state
    |> MQ.publish(
      Application.fetch_env!(:engine, :outgoing_booking_exchange),
      "assigned"
    )

    Logger.debug("booking was assigned", updated_state)
    {:reply, true, updated_state}
  end

  def handle_call({:add_event, status}, _, state) do
    new_event = %{timestamp: DateTime.utc_now(), type: String.to_atom(status)}

    updated_state =
      Map.update!(state, :events, fn events -> [new_event | events] end)
      |> MQ.publish(@outgoing_booking_exchange, status)

    {:reply, true, updated_state}
  end
end
