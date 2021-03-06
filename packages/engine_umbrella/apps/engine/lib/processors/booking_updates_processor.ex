defmodule Engine.BookingUpdatesProcessor do
  use Broadway
  require Logger
  @incoming_booking_exchange Application.compile_env!(:engine, :incoming_booking_exchange)
  @picked_up_routing_key "picked_up"
  @delivered_routing_key "delivered"
  @delivery_failed_routing_key "delivery_failed"
  @update_bookings_statuses_queue "update_booking_status_in_engine"

  def start_link(_opts) do
    rmq_producer = Application.fetch_env!(:engine, :rmq_producer)

    Broadway.start_link(__MODULE__,
      name: __MODULE__,
      producer: [
        module:
          {rmq_producer,
           after_connect: fn %AMQP.Channel{} = channel ->
             Logger.info("#{__MODULE__} connected to rabbitmq")
             AMQP.Exchange.declare(channel, @incoming_booking_exchange, :topic, durable: true)
           end,
           queue: @update_bookings_statuses_queue,
           connection: [
             host: Application.fetch_env!(:engine, :amqp_host)
           ],
           declare: [arguments: [{"x-dead-letter-exchange", "engine_DLX"}], durable: true],
           on_failure: :reject,
           bindings: [
             {@incoming_booking_exchange, routing_key: @picked_up_routing_key},
             {@incoming_booking_exchange, routing_key: @delivered_routing_key},
             {@incoming_booking_exchange, routing_key: @delivery_failed_routing_key}
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

  def handle_message(_, %Broadway.Message{data: booking_update} = msg, _) do
    %{"id" => id, "status" => status} =
      booking_update
      |> Jason.decode!()

    Booking.add_event(id, status)

    msg
  end
end
