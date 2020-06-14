defmodule Vehicle do
  use GenServer

  defstruct id: 0,
            external_id: 0,
            position: %{lon: 53, lat: 14},
            heading: nil,
            busy: false,
            instructions: [],
            orsm_route: nil,
            booking_ids: []

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
         %Vehicle{id: vehicle_id, instructions: _instructions, booking_ids: booking_ids} = vehicle},
        state
      ) do
    IO.inspect(vehicle, label: "offer to vehicle")

    booking_ids
    |> Enum.map(fn booking_id ->
      MQ.call(%{vehicle: %{id: vehicle_id}, booking: Booking.get(booking_id)}, "pickup_offers")
      |> Poison.decode()
      |> IO.inspect(label: "the driver answered")
      |> handle_driver_response(vehicle_id, booking_id)
    end)

    {:noreply, nil, state}
  end

  def handle_driver_response({:ok, true}, vehicle_id, booking_id) do
    Booking.assign(booking_id, vehicle_id)
    |> IO.inspect(label: "booking was assigned")
  end

  def handle_driver_response({:ok, false}, _, _), do: IO.puts("Driver didnt want the booking :(")

  def make(external_id, position, busy \\ false) do
    id = external_id

    GenServer.start_link(
      __MODULE__,
      %Vehicle{
        id: id,
        external_id: external_id,
        position: position,
        busy: busy
      },
      name: via_tuple(id)
    )

    id
  end

  defp via_tuple(id) when is_binary(id), do: via_tuple(String.to_integer(id))

  defp via_tuple(id) when is_integer(id) do
    {:via, :gproc, {:n, :l, {:vehicle_id, id}}}
  end

  def get(id) do
    GenServer.call(via_tuple(id), :get)
  end

  def offer(%Vehicle{id: id, instructions: instructions, booking_ids: booking_ids} = vehicle) do
    GenServer.cast(via_tuple(id), {:offer, vehicle})
  end
end
