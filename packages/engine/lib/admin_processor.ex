defmodule Engine.AdminProcessor do
  use Broadway

  def start_link(_opts) do
    MQ.declare_queue("dispatch_offers")

    Broadway.start_link(__MODULE__,
      name: __MODULE__,
      producer: [
        module: {BroadwayRabbitMQ.Producer, queue: "dispatch_offers"}
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
