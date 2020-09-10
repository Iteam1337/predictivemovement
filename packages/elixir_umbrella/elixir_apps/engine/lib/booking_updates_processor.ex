defmodule Engine.BookingUpdatesProcessor do
  use Broadway
  require Logger
  @incoming_booking_exchange Application.compile_env!(:engine, :incoming_booking_exchange)
  @picked_up_routing_key "picked_up"
  @delivered_routing_key "delivered"
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
             {@incoming_booking_exchange, routing_key: @delivered_routing_key}
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
    with %{id: id, status: status} <- Poison.decode!(booking_update, keys: :atoms),
         true <- Booking.add_event(id, status) do
      Logger.debug("Booking with ID #{id} has been assigned status #{status}")
    else
      {:error, error_msg} ->
        Logger.error("Could not set status: #{error_msg}")

      other_error ->
        Logger.error("Could not set status: #{other_error}")
    end

    msg
  end
end
