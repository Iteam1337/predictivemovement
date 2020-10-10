defmodule Booking do
  use GenServer
  require Logger
  alias Engine.ES
  @derive Jason.Encoder

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

  def make(%{
        pickup: pickup,
        delivery: delivery,
        external_id: external_id,
        metadata: metadata,
        size: size
      }) do
    id = "pmb-" <> (Base62UUID.generate() |> String.downcase() |> String.slice(0, 8))

    %Booking{
      id: id,
      pickup: pickup,
      external_id: external_id,
      delivery: delivery,
      metadata: metadata |> Jason.encode!(),
      events: [],
      size: size,
      route: Osrm.route(pickup, delivery)
    }
    |> add_event_to_events_list("new", DateTime.utc_now())
    |> apply_booking_to_state()
    |> (&ES.add_event(%BookingRegistered{booking: &1})).()

    id
  end

  def apply_booking_to_state(%Booking{id: id} = booking) do
    GenServer.start_link(
      __MODULE__,
      booking,
      name: via_tuple(id)
    )

    MQ.publish(booking, @outgoing_booking_exchange, "new")

    Engine.BookingStore.put_booking(id)
    booking
  end

  def get(id), do: GenServer.call(via_tuple(id), :get)

  def delete(id) do
    Engine.BookingStore.delete_booking(id)
    GenServer.stop(via_tuple(id))
  end

  def assign(booking_id, vehicle) do
    time_stamp = DateTime.utc_now()
    apply_assign_to_state(booking_id, vehicle, time_stamp)

    %BookingAssigned{
      booking_id: booking_id,
      vehicle: vehicle,
      time_stamp: time_stamp
    }
    |> ES.add_event()
  end

  def apply_assign_to_state(booking_id, vehicle, time_stamp),
    do: GenServer.call(via_tuple(booking_id), {:assign, vehicle, time_stamp})

  def add_event(booking_id, status)
      when status in ["picked_up", "delivered", "delivery_failed"] do
    time_stamp = DateTime.utc_now()
    apply_event_to_state(booking_id, status, time_stamp)

    status
    |> event_to_event_store_struct(booking_id, time_stamp)
    |> ES.add_event()
  end

  def apply_event_to_state(booking_id, status, time_stamp),
    do: GenServer.call(via_tuple(booking_id), {:add_event, status, time_stamp})

  ### Internal

  defp via_tuple(id) when is_integer(id), do: via_tuple(Integer.to_string(id))

  defp via_tuple(id) when is_binary(id), do: {:via, :gproc, {:n, :l, {:booking_id, id}}}

  def init(init_arg) do
    {:ok, init_arg}
  end

  def handle_call(:get, _from, state), do: {:reply, state, state}

  def handle_call({:assign, vehicle, time_stamp}, _from, state) do
    updated_state =
      state
      |> Map.put(:assigned_to, %{
        id: vehicle.id,
        metadata: vehicle.metadata
      })
      |> add_event_to_events_list("assigned", time_stamp)
      |> MQ.publish(
        Application.fetch_env!(:engine, :outgoing_booking_exchange),
        "assigned"
      )

    Logger.debug("booking was assigned", updated_state)
    {:reply, true, updated_state}
  end

  def handle_call({:add_event, status, time_stamp}, _, state) do
    Logger.info("Received event #{status} for booking: #{state.id} ")

    updated_state =
      state
      |> add_event_to_events_list(status, time_stamp)
      |> MQ.publish(@outgoing_booking_exchange, status)

    {:reply, true, updated_state}
  end

  defp add_event_to_events_list(booking, status, time_stamp) do
    new_event = %{timestamp: time_stamp, type: String.to_atom(status)}

    booking
    |> Map.update!(:events, fn events -> [new_event | events] end)
  end

  defp event_to_event_store_struct("picked_up", booking_id, time_stamp),
    do: %BookingPickedUp{booking_id: booking_id, time_stamp: time_stamp}

  defp event_to_event_store_struct("delivered", booking_id, time_stamp),
    do: %BookingDelivered{booking_id: booking_id, time_stamp: time_stamp}

  defp event_to_event_store_struct("delivery_failed", booking_id, time_stamp),
    do: %BookingDeliveryFailed{booking_id: booking_id, time_stamp: time_stamp}
end
