defmodule Engine.VehicleDeleteProcessor do
  use Broadway

  @incoming_vehicle_exchange Application.compile_env!(:engine, :incoming_vehicle_exchange)
  @deleted_routing_key "deleted"

  @delete_vehicle_queue "delete_vehicle_from_engine"

  def start_link(_opts) do
    Broadway.start_link(__MODULE__,
      name: __MODULE__,
      producer: [
        module:
          {BroadwayRabbitMQ.Producer,
           queue: @delete_vehicle_queue,
           connection: [
             host: Application.fetch_env!(:engine, :amqp_host)
           ],
           declare: [],
           bindings: [
             {@incoming_vehicle_exchange, routing_key: @deleted_routing_key}
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

  defp delete_vehicle(id) do
    Vehicle.delete(id)
    booking_ids = Engine.BookingStore.get_bookings()
    vehicle_ids = Engine.VehicleStore.get_vehicles()

    Engine.BookingProcessor.calculate_plan(vehicle_ids, booking_ids)
  end

  def handle_message(_, %Broadway.Message{data: id} = msg, _) do
    if id in Engine.VehicleStore.get_vehicles() do
      delete_vehicle(id)
    end

    msg
  end
end
