defmodule Engine.MatchProducer do
  use GenStage
  alias Broadway.Message

  @incoming_vehicle_exchange Application.compile_env!(:engine, :incoming_vehicle_exchange)
  @incoming_booking_exchange Application.compile_env!(:engine, :incoming_booking_exchange)

  def start_link(_) do
    GenStage.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init(_) do
    MQ.create_match_producer_resources()
    {:producer, %{}}
  end

  defp handle_new_booking(booking_msg, _) do
    IO.puts("new booking!")
    new_booking = string_to_booking_transform(booking_msg)

    message = %Message{
      data: %{booking: new_booking},
      acknowledger: {__MODULE__, :ack_id, :ack_data}
    }

    {:noreply, [message], %{}}
  end

  defp handle_new_vehicle(vehicle_msg, _) do
    IO.puts("new vehicle!")
    new_vehicle = string_to_vehicle_transform(vehicle_msg)

    message = %Message{
      data: %{vehicle: new_vehicle},
      acknowledger: {__MODULE__, :ack_id, :ack_data}
    }

    {:noreply, [message], %{}}
  end

  ## helpers

  defp string_to_vehicle_transform(vehicle_string) do
    vehicle_string
    |> Jason.decode!(keys: :atoms)
    |> Map.delete(:id)
  end

  defp string_to_booking_transform(booking_string) do
      Jason.decode!(booking_string, keys: :atoms)
      |> Map.put_new(:metadata, %{})
      |> Map.put_new(:size, nil)
  end

  # Rabbitmq callbacks
  def handle_info({:basic_consume_ok, _}, state), do: {:noreply, [], state}

  def handle_info({:basic_deliver, vehicle, %{exchange: @incoming_vehicle_exchange}}, state),
    do: handle_new_vehicle(vehicle, state)

  def handle_info({:basic_deliver, booking, %{exchange: @incoming_booking_exchange}}, state),
    do: handle_new_booking(booking, state)

  ## handle backpressure

  def handle_demand(_demand, state) do
    {:noreply, [], state}
  end

  def ack(_ack_ref, _successful, _failed) do
    :ok
  end
end
