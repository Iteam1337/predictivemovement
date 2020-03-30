import Config
config :booking_simulator, :amqp_host, System.get_env("AMQP_HOST") || "amqp://localhost"
config :booking_simulator, :exchange, System.get_env("EXCHANGE") || "bookings"
