defmodule Engine.VehicleUpdateProcessor do
  use Broadway
  require Logger

  @incoming_vehicle_exchange Application.compile_env!(:engine, :incoming_vehicle_exchange)
  @update_vehicle_routing_key "update"
  @update_vehicle_queue "update_vehicle_in_engine"

  def start_link(_opts) do
    Broadway.start_link(__MODULE__,
      name: __MODULE__,
      producer: [
        module:
          {BroadwayRabbitMQ.Producer,
           after_connect: fn %AMQP.Channel{} = channel ->
             Logger.info("#{__MODULE__} connected to rabbitmq")
             AMQP.Exchange.declare(channel, @incoming_vehicle_exchange, :topic, durable: true)
           end,
           queue: @update_vehicle_queue,
           connection: [
             host: Application.fetch_env!(:engine, :amqp_host)
           ],
           declare: [arguments: [{"x-dead-letter-exchange", "engine_DLX"}], durable: true],
           on_failure: :reject,
           bindings: [
             {@incoming_vehicle_exchange, routing_key: @update_vehicle_routing_key}
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

  def handle_message(_, %Broadway.Message{data: vehicle_update} = msg, _) do
    vehicle_update
    |> Jason.decode!()
    |> Map.delete("current_route")
    |> Map.Helpers.atomize_keys()
    |> Vehicle.update()

    msg
  end
end
