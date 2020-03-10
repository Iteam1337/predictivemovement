import Config
config :car_simulator, :amqp_host, System.get_env("AMQP_HOST") || "amqp://localhost"
