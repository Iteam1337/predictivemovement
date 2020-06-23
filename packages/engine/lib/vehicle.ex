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

    route =
      activities
      |> Enum.map(fn %{address: address} -> address end)
      |> Osrm.route()

    MQ.call(
      %{
        vehicle: %{id: vehicle_id, metadata: state.metadata},
        route: route,
        plan: activities,
        booking_ids: booking_ids
      },
      "pickup_offers"
    )
    |> Poison.decode()
    |> IO.inspect(label: "the driver answered")
    |> handle_driver_response(%{id: vehicle_id, metadata: state.metadata}, booking_ids)

    {:noreply, state}
  end

  def handle_driver_response({:ok, true}, vehicle, booking_ids) do
    booking_ids
    |> Enum.map(fn booking_id ->
      Booking.assign(booking_id, vehicle)
    end)
    |> IO.inspect(label: "booking was assigned")
  end

  def handle_driver_response({:ok, false}, _, _), do: IO.puts("Driver didnt want the booking :(")

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
