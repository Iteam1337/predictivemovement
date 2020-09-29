import Config
config :engine, :amqp_host, System.get_env("AMQP_HOST") || "localhost"
config :engine, :osrm_url, System.get_env("OSRM_URL") || "https://osrm.iteamdev.io"
config :engine, :redis_url, System.get_env("REDIS_URL") || "redis://localhost:6379"
config :engine, :init_from_storage, System.get_env("INIT_FROM_STORAGE") == "true"
