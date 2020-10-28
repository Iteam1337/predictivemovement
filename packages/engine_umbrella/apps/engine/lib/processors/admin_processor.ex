defmodule Engine.AdminProcessor do
  use Broadway
  require Logger

  def start_link(_opts) do
    Broadway.start_link(__MODULE__,
      name: __MODULE__,
      producer: [
        module:
          {BroadwayRabbitMQ.Producer,
           after_connect: fn _ -> Logger.info("#{__MODULE__} connected to rabbitmq") end,
           queue: "dispatch_offers",
           declare: [arguments: [{"x-dead-letter-exchange", "engine_DLX"}], durable: true],
           on_failure: :reject,
           connection: [
             host: Application.fetch_env!(:engine, :amqp_host)
           ]}
      ],
      processors: [
        default: [
          concurrency: 100
        ]
      ]
    )
  end

  def handle_message(_, message, _) do
    Dispatcher.dispatch_offers()
    message
  end
end
