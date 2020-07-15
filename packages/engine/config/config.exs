import Config

# this is compile time config

config :engine, :plan, Plan
config :engine, :vehicle, Vehicle

config :engine, :clear_match_producer_state_queue, "clear_state"
config :engine, :outgoing_vehicle_exchange, "outgoing_vehicle_updates"
config :engine, :incoming_vehicle_exchange, "incoming_vehicle_updates"
config :engine, :outgoing_booking_exchange, "outgoing_booking_updates"
config :engine, :incoming_booking_exchange, "incoming_booking_updates"

config :logger, level: :warn
import_config "#{Mix.env()}.exs"
