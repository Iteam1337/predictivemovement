defmodule Engine.BookingDeleteProcessor do
  use Broadway
  require Logger

  @incoming_booking_exchange Application.compile_env!(:engine, :incoming_booking_exchange)
  @deleted_routing_key "deleted"

  @delete_booking_queue "delete_booking_from_engine"

  def start_link(_opts) do
    Broadway.start_link(__MODULE__,
      name: __MODULE__,
      producer: [
        module:
          {BroadwayRabbitMQ.Producer,
           after_connect: fn %AMQP.Channel{} = channel ->
             Logger.info("#{__MODULE__} connected to rabbitmq")
             AMQP.Exchange.declare(channel, @incoming_booking_exchange, :topic, durable: false)
           end,
           queue: @delete_booking_queue,
           declare: [arguments: [{"x-dead-letter-exchange", "engine_DLX"}]],
           on_failure: :reject,
           connection: [
             host: Application.fetch_env!(:engine, :amqp_host)
           ],
           bindings: [
             {@incoming_booking_exchange, routing_key: @deleted_routing_key}
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

  defp delete_booking(id) do
    Booking.delete(id)
    booking_ids = Engine.BookingStore.get_bookings()
    vehicle_ids = Engine.VehicleStore.get_vehicles()

    Engine.BookingProcessor.calculate_plan(vehicle_ids, booking_ids)
  end

  def handle_message(_, %Broadway.Message{data: id} = msg, _) do
    if id in Engine.BookingStore.get_bookings() do
      delete_booking(id)
    end

    msg
  end
end
