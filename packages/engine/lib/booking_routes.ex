defmodule BookingRoutes do
  use Broadway
  use AMQP

  @exchange_bookings "bookings"

  @exchange_bookings_with_routes "bookings_with_routes"
  @queue_bookings_add_routes "booking_add_routes_worker"

  @routing_key "new"

  def start_link(_opts) do
    Broadway.start_link(__MODULE__,
      name: __MODULE__,
      producer: [
        module:
          {BroadwayRabbitMQ.Producer,
           queue: @queue_bookings_add_routes,
           connection: [
             host: Application.fetch_env!(:engine, :amqp_host)
           ],
           declare: [],
           bindings: [{@exchange_bookings, routing_key: @routing_key}]},
        concurrency: 1
      ],
      processors: [
        default: [
          concurrency: 50
        ]
      ]
    )
  end

  def handle_message(_, message, _) do
    payload = message.data |> Poison.decode!(%{keys: :atoms})
    route = Osrm.route(payload |> Map.get(:pickup), payload |> Map.get(:delivery))
    channel = elem(message.acknowledger, 1)
    Exchange.declare(channel, @exchange_bookings_with_routes, :topic)

    Basic.publish(
      channel,
      @exchange_bookings_with_routes,
      @routing_key,
      Poison.encode!(payload |> Map.put(:route, route))
    )

    message
  end
end
