import Config
config :engine, Adapters.RMQ, Engine.Adapters.MockRMQ
config :engine, :rmq_producer, Broadway.DummyProducer

config :engine, Engine.ES,
  serializer: Engine.JsonSerializer,
  username: "postgres",
  password: "postgres",
  database: "eventstore",
  hostname: "localhost",
  schema: "test"
