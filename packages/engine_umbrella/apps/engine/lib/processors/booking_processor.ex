defmodule Engine.BookingProcessor do
  use Broadway
  alias Broadway.Message
  require Logger

  def start_link(_opts) do
    Broadway.start_link(__MODULE__,
      name: __MODULE__,
      producer: [
        module: {Engine.MatchProducer, []},
        concurrency: 1
      ],
      processors: [
        default: [
          concurrency: 100
        ]
      ],
      batchers: [
        default: [
          batch_size: Application.get_env(:engine, :booking_processor_batch_size),
          batch_timeout: Application.get_env(:engine, :booking_processor_batch_timeout)
        ]
      ]
    )
  end

  def handle_message(
        _processor,
        %Message{
          data: %{
            booking: booking
          }
        } = msg,
        _context
      ) do
    id =
      booking
      |> string_to_booking_transform()
      |> IO.inspect(label: "a new booking")
      |> Booking.make()

    Logger.info("Booking with id: #{id} created")

    msg
  end

  def handle_message(
        _processor,
        %Message{data: %{vehicle: vehicle}} = msg,
        _context
      ) do
    id =
      vehicle
      |> string_to_vehicle_transform()
      |> IO.inspect(label: "creating a new vehicle")
      |> Vehicle.make()

    Logger.info("Vehicle with id: #{id} created")
    msg
  end

  def handle_batch(
        _batcher,
        messages,
        _batch_info,
        _context
      ) do
    IO.puts("a new batch of data")
    booking_ids = Engine.BookingStore.get_bookings()
    vehicle_ids = Engine.VehicleStore.get_vehicles()

    Plan.calculate(vehicle_ids, booking_ids)
    messages
  end

  defp string_to_vehicle_transform(vehicle_string) do
    vehicle_string
    |> Jason.decode!(keys: :atoms)
  end

  defp string_to_booking_transform(booking_string) do
    Jason.decode!(booking_string, keys: :atoms)
    |> Map.put_new(:metadata, %{})
    |> Map.put_new(:size, nil)
  end
end
