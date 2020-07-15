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

  def handle_info({:basic_consume_ok, _}, state), do: {:noreply, [], state}

  def handle_info(
        {:basic_deliver, vehicle, %{exchange: @incoming_vehicle_exchange}},
        %{
          vehicles: vehicles,
          bookings: bookings
        }
      ) do
    IO.puts("new vehicle!")
    vehicle = string_to_vehicle_transform(vehicle)

    dispatch_events([vehicle | vehicles], bookings)
  end

  def handle_info(
        {:basic_deliver, booking, %{exchange: @incoming_booking_exchange}},
        %{
          vehicles: vehicles,
          bookings: bookings
        }
      ) do
    IO.puts("new booking!")
    booking = string_to_booking_transform(booking)
    IO.inspect(bookings, label: "current bookings state")
    dispatch_events(vehicles, [booking | bookings])
  end

  def handle_info(
        {:basic_deliver, _, %{routing_key: @clear_queue}},
        _
      ) do
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

  ## handle backpressure

  def handle_demand(_demand, state) do
    {:noreply, [], state}
  end

  def ack(_ack_ref, _successful, _failed) do
    :ok
  end

  ## helpers

  def string_to_vehicle_transform(vehicle_string) do
    %{position: position, metadata: metadata} =
      vehicle_string |> Poison.decode!(keys: :atoms) |> Map.put_new(:metadata, %{})

    Vehicle.make(position, metadata)
  end

  def string_to_booking_transform(booking_string) do
    %{pickup: pickup, delivery: delivery, id: external_id, metadata: metadata} =
      Poison.decode!(booking_string, keys: :atoms)
      |> Map.put_new(:metadata, %{})

    Booking.make(pickup, delivery, external_id, metadata)
  end
end
