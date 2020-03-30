import Config
config :engine, :amqp_host, System.get_env("amqp_host") || "amqp://localhost"
config :engine, :cars_exchange, System.get_env("CARS_EXCHANGE") || "cars"
config :engine, :bookings_exchange, System.get_env("BOOKINGS_EXCHANGE") || "bookings"
