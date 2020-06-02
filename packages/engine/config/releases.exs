import Config
config :engine, :amqp_host, System.get_env("AMQP_HOST") || "localhost"
