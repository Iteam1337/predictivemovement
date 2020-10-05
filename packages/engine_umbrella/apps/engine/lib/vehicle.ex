defmodule Vehicle do
  use GenServer
  require Logger
  alias Engine.ES
  @derive Jason.Encoder

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

  def handle_call(:get, _from, state), do: {:reply, state, state}

  def handle_call(
        {:offer,
         %Vehicle{id: vehicle_id, activities: activities, booking_ids: booking_ids} = vehicle},
        state
      ) do
    Logger.debug("offer to vehicle #{vehicle}")

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
    Logger.info("Driver #{current_state.id} accepted")

    proposed_state.booking_ids
    |> Enum.map(fn booking_id ->
      Booking.assign(booking_id, current_state)
    end)

    updated_state =
      current_state
      |> Map.merge(proposed_state)
      |> MQ.publish(
        Application.fetch_env!(:engine, :outgoing_vehicle_exchange),
        "new_instructions"
      )

    updated_state
  end

  def handle_driver_response({:ok, false}, _, state) do
    Logger.info("Driver didnt want the booking :(")
    state
  end

  def handle_info({:basic_cancel_ok, _}, state), do: {:noreply, state}

  defp generate_id,
    do: "pmv-" <> (Base62UUID.generate() |> String.downcase() |> String.slice(0, 8))

  def make(vehicle_info, options \\ []) do
    vehicle_fields =
      vehicle_info
      |> Map.put_new(:end_address, Map.get(vehicle_info, :start_address))
      |> Map.put_new(:id, generate_id())
      |> Map.put_new(:capacity, %{volume: 15, weight: 700})
      |> Map.put_new(:metadata, %{})

    struct(Vehicle, vehicle_fields)
    |> apply_vehicle_to_state()
    |> MQ.publish(Application.fetch_env!(:engine, :outgoing_vehicle_exchange), "new")
    |> (&%VehicleRegistered{vehicle: &1}).()
    |> ES.add_event()

    vehicle_fields.id
  end

  def apply_vehicle_to_state(%Vehicle{id: id} = vehicle) do
    GenServer.start_link(
      __MODULE__,
      vehicle,
      name: via_tuple(id)
    )

    Engine.VehicleStore.put_vehicle(id)

    vehicle
  end

  def delete(id) do
    Engine.RedisAdapter.delete_vehicle(id)
    Engine.VehicleStore.delete_vehicle(id)
    GenServer.stop(via_tuple(id))
  end

  defp via_tuple(id), do: {:via, :gproc, {:n, :l, {:vehicle_id, id}}}

  def get(id), do: GenServer.call(via_tuple(id), :get)

  def offer(%Vehicle{id: id} = vehicle), do: GenServer.call(via_tuple(id), {:offer, vehicle})
end
