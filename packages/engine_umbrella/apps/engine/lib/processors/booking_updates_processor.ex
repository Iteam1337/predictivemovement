defmodule Engine.BookingUpdatesProcessor do
  use Broadway

  @incoming_booking_exchange Application.compile_env!(:engine, :incoming_booking_exchange)
  @picked_up_routing_key "picked_up"
  @delivered_routing_key "delivered"
  @delivery_failed_routing_key "delivery_failed"
  @update_bookings_statuses_queue "update_booking_status_in_engine"

  def start_link(_opts) do
    Broadway.start_link(__MODULE__,
      name: __MODULE__,
      producer: [
        module:
          {BroadwayRabbitMQ.Producer,
           queue: @update_bookings_statuses_queue,
           connection: [
             host: Application.fetch_env!(:engine, :amqp_host)
           ],
           declare: [],
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
    %{id: id, status: status} =
      booking_update
      |> Poison.decode!(keys: :atoms)

    Booking.add_event(id, status)

    msg
  end
end
