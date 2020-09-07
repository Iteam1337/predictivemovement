defmodule Vehicle do
  use GenServer
  require Logger

  defstruct [
    :id,
    :busy,
    :activities,
    :current_route,
    :booking_ids,
    :metadata,
    :start_address,
    :end_address,
    :earliest_start,
    :latest_end,
    :profile,
    :capacity
  ]

  def init(init_arg) do
    {:ok, init_arg}
  end

  def handle_call(:get, _from, state) do
    {:reply, state, state}
  end

  def handle_cast(
        {:offer,
         %Vehicle{id: vehicle_id, activities: activities, booking_ids: booking_ids} = vehicle},
        state
      ) do
    Logger.debug("offer to vehicle", vehicle)

    current_route =
      activities
      |> Enum.map(fn %{address: address} -> address end)
      |> Osrm.route()

    updated_state =
      MQ.call(
        %{
          vehicle: %{id: vehicle_id, metadata: state.metadata},
          current_route: current_route,
          activities: activities,
          booking_ids: booking_ids
        },
        "offer_booking_to_vehicle"
      )
      |> Poison.decode()
      |> handle_driver_response(
        %{
          booking_ids: booking_ids,
          activities: activities,
          current_route: current_route
        },
        state
      )

    {:noreply, updated_state}
  end

  def handle_driver_response(
        {:ok, true},
        proposed_state,
        current_state
      ) do
    proposed_state.booking_ids
    |> Enum.map(fn booking_id ->
      Booking.assign(booking_id, current_state)
    end)

    updated_state =
      current_state
      |> Map.merge(proposed_state)
      |> MQ.publish(Application.fetch_env!(:engine, :outgoing_vehicle_exchange), "plan_updated")

    updated_state
  end

  def handle_driver_response({:ok, false}, _, state) do
    Logger.debug("Driver didnt want the booking :(")
    state
  end

  def make(
        start_address,
        end_address,
        earliest_start,
        latest_end,
        metadata,
        profile,
        capacity
      )
      when is_nil(end_address) do
    make(
      start_address,
      start_address,
      earliest_start,
      latest_end,
      metadata,
      profile,
      capacity
    )
  end

  def make(
        start_address,
        end_address,
        earliest_start,
        latest_end,
        metadata,
        profile,
        capacity
      ) do
    id = "pmv-" <> (Base62UUID.generate() |> String.slice(0, 8))

    vehicle = %Vehicle{
      id: id,
      start_address: start_address,
      end_address: end_address,
      profile: profile,
      capacity: capacity,
      earliest_start: earliest_start,
      latest_end: latest_end,
      metadata: metadata
    }

    GenServer.start_link(
      __MODULE__,
      vehicle,
      name: via_tuple(id)
    )

    MQ.publish(vehicle, Application.fetch_env!(:engine, :outgoing_vehicle_exchange), "new")

    id
  end

  defp via_tuple(id) do
    {:via, :gproc, {:n, :l, {:vehicle_id, id}}}
  end

  def get(id) do
    GenServer.call(via_tuple(id), :get)
  end

  def offer(%Vehicle{id: id, activities: activities, booking_ids: booking_ids} = vehicle) do
    GenServer.cast(via_tuple(id), {:offer, vehicle})
  end
end
