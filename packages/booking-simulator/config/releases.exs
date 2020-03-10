import Config
config :booking_simulator, :amqp_host, System.get_env("AMQP_HOST") || "amqp://localhost"
config :booking_simulator, :queue, System.get_env("QUEUE") || "simulated_bookings"
