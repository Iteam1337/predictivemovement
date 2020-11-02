import Config

config :engine, :plan, Plan
config :engine, :vehicle, Vehicle
config :engine, event_stores: [Engine.ES]

config :engine, :outgoing_vehicle_exchange, "outgoing_vehicle_updates"
config :engine, :incoming_vehicle_exchange, "incoming_vehicle_updates"
config :engine, :outgoing_booking_exchange, "outgoing_booking_updates"
config :engine, :incoming_booking_exchange, "incoming_booking_updates"
config :engine, :outgoing_plan_exchange, "outgoing_plan_updates"

config :engine, :amqp_host, System.get_env("AMQP_HOST") || "localhost"
config :engine, :osrm_url, System.get_env("OSRM_URL") || "https://osrm.iteamdev.io"
config :engine, :init_from_eventstore, System.get_env("INIT_FROM_EVENTSTORE") == "true"

config :engine,
       :booking_processor_batch_size,
       if(System.get_env("BOOKING_PROCESSOR_BATCH_SIZE") != nil,
         do: System.get_env("BOOKING_PROCESSOR_BATCH_SIZE") |> String.to_integer(),
         else: 1
       )

config :engine,
       :booking_processor_batch_timeout,
       if(System.get_env("BOOKING_PROCESSOR_BATCH_TIMEOUT") != nil,
         do: System.get_env("BOOKING_PROCESSOR_BATCH_TIMEOUT") |> String.to_integer(),
         else: 1000
       )

config :engine, Engine.ES,
  serializer: Engine.JsonSerializer,
  username: System.get_env("POSTGRES_USER") || "postgres",
  password: System.get_env("POSTGRES_PASSWORD") || "postgres",
  database: System.get_env("POSTGRES_DB") || "eventstore",
  hostname: System.get_env("POSTGRES_HOST") || "localhost"

config :logger, level: :info
config :logger, handle_otp_reports: false
