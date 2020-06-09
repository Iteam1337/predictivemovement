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

  # def make(id, position, busy \\ false) do
  #   %Vehicle{id: id, position: position, busy: busy}
  # end

  # def offer(%Vehicle{id: id, instructions: instructions, booking_ids: booking_ids} = vehicle) do
  #   IO.inspect(vehicle, label: "offer to vehicle")
  #   instructions_without_start = Enum.filter(instructions, &Map.has_key?(&1, :id))

  #   accepted_bookings =
  #     booking_ids
  #     |> Enum.map(fn id ->
  #       Enum.filter(instructions_without_start, fn instruction -> instruction.id == id end)
  #     end)
  #     |> IO.inspect(label: "instructions for booking")
  #     |> Enum.map(fn instructions_for_booking ->
  #       instruction =
  #         instructions_for_booking
  #         |> Enum.map(fn %{address: address, type: type} -> {address, type} end)

  #       booking =
  #         Map.new()
  #         |> Map.put(
  #           :pickup,
  #           Enum.find(instruction, fn {_, type} -> type == "pickupShipment" end)
  #           |> elem(0)
  #         )
  #         |> Map.put(
  #           :delivery,
  #           Enum.find(instruction, fn {_, type} -> type == "deliverShipment" end)
  #           |> elem(0)
  #         )
  #         |> IO.inspect(label: "booking")

  #       {:ok, accepted} =
  #         MQ.call(%{vehicle: %{id: id}, booking: booking}, "pickup_offers", "p_response")
  #         |> Poison.decode()
  #         |> IO.inspect(label: "the driver answered")

  #       %{vehicle: vehicle, booking: booking, accepted: accepted}
  #     end)
  #     |> Enum.filter(fn %{accepted: accepted} -> accepted end)

  #   %{vehicle: vehicle, booking_ids: booking_ids, accepted_bookings: accepted_bookings}
  # end

  def init(init_arg) do
    {:ok, init_arg}
  end

  def handle_call({:put, id, position, busy}, _from, _state) do
    {:reply, :ok}
  end

  def handle_call(:get, _from, state) do
    {:reply, state, state}
  end

  def handle_call(
        {:offer,
         %Vehicle{id: id, instructions: instructions, booking_ids: booking_ids} = vehicle},
        _from,
        state
      ) do
    IO.inspect(vehicle, label: "offer to vehicle")
    instructions_without_start = Enum.filter(instructions, &Map.has_key?(&1, :id))

    accepted_bookings =
      booking_ids
      |> Enum.map(fn id ->
        Enum.filter(instructions_without_start, fn instruction -> instruction.id == id end)
      end)
      |> IO.inspect(label: "instructions for booking")
      |> Enum.map(fn instructions_for_booking ->
        instruction =
          instructions_for_booking
          |> Enum.map(fn %{address: address, type: type} -> {address, type} end)

        booking =
          Map.new()
          |> Map.put(
            :pickup,
            Enum.find(instruction, fn {_, type} -> type == "pickupShipment" end)
            |> elem(0)
          )
          |> Map.put(
            :delivery,
            Enum.find(instruction, fn {_, type} -> type == "deliverShipment" end)
            |> elem(0)
          )
          |> IO.inspect(label: "booking")

        {:ok, accepted} =
          MQ.call(%{vehicle: %{id: id}, booking: booking}, "pickup_offers", "p_response")
          |> Poison.decode()
          |> IO.inspect(label: "the driver answered")

        %{vehicle: vehicle, booking: booking, accepted: accepted}
      end)
      |> Enum.filter(fn %{accepted: accepted} -> accepted end)

    {:reply, %{vehicle: vehicle, booking_ids: booking_ids, accepted_bookings: accepted_bookings},
     state
     |> Map.put(:instructions, instructions)
     |> Map.put(:booking_ids, booking_ids)}
  end

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
    IO.inspect(id, label: "via tuple")
    {:via, :gproc, {:n, :l, {:vehicle_id, id}}}
  end

  def get(id) do
    GenServer.call(via_tuple(id), :get)
  end

  def offer(%Vehicle{id: id, instructions: instructions, booking_ids: booking_ids} = vehicle) do
    GenServer.call(via_tuple(id), {:offer, vehicle}, :infinity)
  end
end
