import Config
config :engine, Adapters.RMQ, Engine.Adapters.MockRMQ
config :engine, :rmq_producer, Broadway.DummyProducer
