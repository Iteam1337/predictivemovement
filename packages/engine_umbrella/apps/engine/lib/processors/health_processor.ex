defmodule Engine.HealthProcessor do
  @moduledoc """
  Check various health attributes of the application
  """
  use Broadway
  require Logger

  def start_link(_opts) do
    Broadway.start_link(__MODULE__,
      name: __MODULE__,
      producer: [
        module:
          {BroadwayRabbitMQ.Producer,
           after_connect: fn _ -> Logger.info("#{__MODULE__} connected to rabbitmq") end,
           queue: "check_health",
           declare: [durable: false],
           on_failure: :reject,
           metadata: [:amqp_channel, :correlation_id, :reply_to],
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

  def is_alive? do
    {:ok, _} = Engine.Adapters.RMQ.get_connection()
    true
  rescue
    _e ->
      false
  end

  def handle_message(
        _,
        %{
          metadata: %{
            amqp_channel: amqp_channel,
            correlation_id: correlation_id,
            reply_to: reply_to
          }
        } = message,
        _
      ) do
    status = is_alive?()

    AMQP.Basic.publish(amqp_channel, "", reply_to, Jason.encode!(status),
      correlation_id: correlation_id
    )

    message
  end
end
