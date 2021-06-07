import Config

config :engine, :amqp_host, System.get_env("AMQP_HOST") || "localhost"
config :engine, :osrm_url, System.get_env("OSRM_URL") || "https://osrm.iteamdev.io"
config :engine, :init_from_eventstore, true

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
