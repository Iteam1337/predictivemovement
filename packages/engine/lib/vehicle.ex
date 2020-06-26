defmodule Vehicle do
  use GenServer

  defstruct id: 0,
            position: %{lon: 53, lat: 14},
            busy: false,
            activities: [],
            current_route: nil,
            booking_ids: [],
            metadata: %{}

  def init(init_arg) do
    {:ok, init_arg}
  end

  def handle_call({:put, id, position, busy}, _from, _state) do
    {:reply, :ok}
  end

  def handle_call(:get, _from, state) do
    {:reply, state, state}
  end

  def handle_cast(
        {:offer,
         %Vehicle{id: vehicle_id, activities: activities, booking_ids: booking_ids} = vehicle},
        state
      ) do
    IO.inspect(vehicle, label: "offer to vehicle")

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
        "pickup_offers"
      )
      |> Poison.decode()
      |> IO.inspect(label: "the driver answered")
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
    |> IO.inspect(label: "booking was assigned")

    updated_state =
      current_state
      |> Map.merge(proposed_state)
      |> MQ.publish(Application.fetch_env!(:engine, :vehicles_exchange), "planned")

    updated_state
  end

  def handle_driver_response({:ok, false}, _, state) do
    state
    |> IO.inspect(label: "Driver didnt want the booking :(")
  end

  def make(position, metadata, busy \\ false) do
    id = "pmv-" <> (Base62UUID.generate() |> String.slice(0, 8))

    GenServer.start_link(
      __MODULE__,
      %Vehicle{
        id: id,
        position: position,
        busy: busy,
        metadata: metadata
      },
      name: via_tuple(id)
    )

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
