import Config
config :engine, :amqp_host, System.get_env("AMQP_HOST") || "amqp://localhost"
config :engine, :cars_exchange, System.get_env("CARS_EXCHANGE") || "cars"
config :engine, :bookings_exchange, System.get_env("BOOKINGS_EXCHANGE") || "bookings"
config :engine, :booking_requests_queue, System.get_env("BOOKING_REQUESTS") || "booking_requests"

config :engine,
       :booking_assignments_exchange,
       System.get_env("BOOKING_ASSIGNMENTS") || "booking_assignments"

config :engine, :pickup_offers_queue, System.get_env("PICKUP_OFFERS") || "pickup_offers"
config :engine, :pickup_response_queue, System.get_env("PICKUP_RESPONSE") || "p_response"
