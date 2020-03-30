import Config
config :car_simulator, :amqp_host, System.get_env("AMQP_HOST") || "amqp://localhost"
config :car_simulator, :exchange, System.get_env("EXCHANGE") || "cars"
