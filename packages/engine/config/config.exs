import Config

config :engine, :plan, Plan
config :engine, :vehicle, Vehicle
config :logger, level: :warn
import_config "#{Mix.env()}.exs"
