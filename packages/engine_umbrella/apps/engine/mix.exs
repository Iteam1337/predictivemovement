defmodule Engine.MixProject do
  use Mix.Project

  def project do
    [
      app: :engine,
      version: "0.1.0",
      elixir: "~> 1.10",
      build_path: "../../_build",
      config_path: "../../config/config.exs",
      deps_path: "../../deps",
      lockfile: "../../mix.lock",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      env: [
        amqp_host: "localhost",
        osrm_url: "https://osrm.iteamdev.io",
        redis_url: "redis://localhost:6379",
        init_from_storage: false
      ],
      extra_applications: [:logger, :gproc],
      mod: {Engine.Application, []}
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:message_generator, in_umbrella: true, only: :test},
      {:amqp, "~> 1.5"},
      {:flow, "~> 1.0.0"},
      {:broadway, "~> 0.6.0"},
      {:broadway_rabbitmq, "~> 0.6.0"},
      {:httpoison, "~> 1.6"},
      {:polyline, "~> 1.2"},
      {:jason, "~> 1.2"},
      {:mix_test_watch, "~> 0.8", only: :dev, only: :test, runtime: false},
      {:math, "~> 0.4.0"},
      {:poison, "~> 3.1"},
      {:hackney, git: "https://github.com/benoitc/hackney.git", branch: "master", override: true},
      {:gproc, "~> 0.8.0"},
      {:base62_uuid, "~> 2.0.2"},
      {:redix, ">= 0.11.2"}
      # {:dep_from_hexpm, "~> 0.3.0"},
      # {:dep_from_git, git: "https://github.com/elixir-lang/my_dep.git", tag: "0.1.0"}
    ]
  end
end
