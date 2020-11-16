defmodule Engine.BookingUpdateProcessor do
  use Broadway
  require Logger
  alias Broadway.Message

  @incoming_booking_exchange Application.compile_env!(:engine, :incoming_booking_exchange)
  @update_booking_routing_key "updated"
  @booking_moved "booking_moved"
  @update_booking_queue "update_booking_in_engine"

  def start_link(_opts) do
    Broadway.start_link(__MODULE__,
      name: __MODULE__,
      producer: [
        module:
          {BroadwayRabbitMQ.Producer,
           after_connect: fn %AMQP.Channel{} = channel ->
             Logger.info("#{__MODULE__} connected to rabbitmq")
             AMQP.Exchange.declare(channel, @incoming_booking_exchange, :topic, durable: true)
           end,
           queue: @update_booking_queue,
           connection: [
             host: Application.fetch_env!(:engine, :amqp_host)
           ],
           declare: [arguments: [{"x-dead-letter-exchange", "engine_DLX"}], durable: true],
           on_failure: :reject,
           metadata: [:routing_key],
           bindings: [
             {@incoming_booking_exchange, routing_key: @update_booking_routing_key},
             {@incoming_booking_exchange, routing_key: @booking_moved}
           ]},
        concurrency: 1
      ],
      processors: [
        default: [
          concurrency: 50
        ]
      ]
    )
  end

  def handle_message(_, %Message{data: booking_update} = msg, _) do
    booking_update
    |> Jason.decode!(keys: :atoms!)
    |> Booking.update()

    booking_ids = Engine.BookingStore.get_bookings()
    vehicle_ids = Engine.VehicleStore.get_vehicles()

    Plan.calculate(vehicle_ids, booking_ids)
    msg
  end
end
