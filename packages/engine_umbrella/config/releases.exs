import Config
config :engine, :amqp_host, System.get_env("AMQP_HOST") || "localhost"
config :engine, :osrm_url, System.get_env("OSRM_URL") || "https://osrm.iteamdev.io"
config :engine, :redis_url, System.get_env("REDIS_URL") || "redis://localhost:6379"
config :engine, :init_from_eventstore, System.get_env("INIT_FROM_EVENTSTORE") == "true"

config :engine,
       :booking_processor_batch_size,
       System.get_env("BOOKING_PROCESSOR_BATCH_SIZE") |> String.to_integer() || 100

config :engine,
       :booking_processor_batch_timeout,
       System.get_env("BOOKING_PROCESSOR_BATCH_TIMEOUT") |> String.to_integer() || 1000
