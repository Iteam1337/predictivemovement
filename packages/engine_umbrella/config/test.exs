import Config

config :engine, :amqp_host, System.get_env("AMQP_HOST")
config :engine, :redis_url, System.get_env("REDIS_URL")
config :engine, :init_from_storage, "false"
config :message_generator, :amqp_host, System.get_env("AMQP_HOST")
