import Config

config :engine, :candidates, Candidates
config :engine, :vehicle, Vehicle
import_config "#{Mix.env()}.exs"
