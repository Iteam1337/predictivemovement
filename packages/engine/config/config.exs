import Config

config :engine, :plan, Plan
config :engine, :vehicle, Vehicle
import_config "#{Mix.env()}.exs"
