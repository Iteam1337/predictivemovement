defmodule Engine.MatchProducer do
  use GenStage
  alias Broadway.Message

  @incoming_vehicle_exchange Application.compile_env!(:engine, :incoming_vehicle_exchange)
  @incoming_booking_exchange Application.compile_env!(:engine, :incoming_booking_exchange)

  @clear_queue Application.compile_env!(:engine, :clear_match_producer_state_queue)
  def start_link(_) do
    GenStage.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init(_) do
    MQ.create_match_producer_resources()
    {:producer, %{vehicles: [], bookings: []}}
  end

  defp handle_new_booking(booking_msg, %{vehicles: vehicles, bookings: bookings}) do
    IO.puts("new booking!")
    new_booking = string_to_booking_transform(booking_msg)
    dispatch_events(vehicles, [new_booking | bookings])
  end

  defp handle_new_vehicle(vehicle_msg, %{vehicles: vehicles, bookings: bookings}) do
    IO.puts("new vehicle!")
    new_vehicle = string_to_vehicle_transform(vehicle_msg)
    dispatch_events([new_vehicle | vehicles], bookings)
  end

  ## helpers

  defp string_to_vehicle_transform(vehicle_string) do
    %{position: position, metadata: metadata} =
      vehicle_string |> Poison.decode!(keys: :atoms) |> Map.put_new(:metadata, %{})

    Vehicle.make(position, metadata)
  end

  defp string_to_booking_transform(booking_string) do
    %{pickup: pickup, delivery: delivery, id: external_id, metadata: metadata} =
      Poison.decode!(booking_string, keys: :atoms)
      |> Map.put_new(:metadata, %{})

    Booking.make(pickup, delivery, external_id, metadata)
  end

  def handle_clear_state do
    IO.puts("Clearing MatchProducer state")
    {:noreply, [], %{vehicles: [], bookings: []}}
  end

  ## send messages to broadway and update state

  def dispatch_events(vehicles, [] = _bookings),
    do: {:noreply, [], %{bookings: [], vehicles: vehicles}}

  def dispatch_events(vehicles, bookings) when length(vehicles) < 1,
    do: {:noreply, [], %{bookings: bookings, vehicles: vehicles}}

  def dispatch_events(vehicles, bookings) do
    message = %Message{
      data: {vehicles, bookings},
      acknowledger: {__MODULE__, :ack_id, :ack_data}
    }

    # pick out the message and return the state we want to keep
    {:noreply, [message], %{bookings: bookings, vehicles: vehicles}}
  end

  # Rabbitmq callbacks
  def handle_info({:basic_consume_ok, _}, state), do: {:noreply, [], state}

  def handle_info({:basic_deliver, vehicle, %{exchange: @incoming_vehicle_exchange}}, state),
    do: handle_new_vehicle(vehicle, state)

  def handle_info({:basic_deliver, booking, %{exchange: @incoming_booking_exchange}}, state),
    do: handle_new_booking(booking, state)

  def handle_info({:basic_deliver, _, %{routing_key: @clear_queue}}, _), do: handle_clear_state()

  ## handle backpressure

  def handle_demand(_demand, state) do
    {:noreply, [], state}
  end

  def ack(_ack_ref, _successful, _failed) do
    :ok
  end
end
