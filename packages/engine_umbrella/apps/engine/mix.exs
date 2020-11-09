defmodule Engine.MixProject do
  use Mix.Project

  def project do
    [
      app: :engine,
      version: "0.1.0",
      elixir: "~> 1.11",
      build_path: "../../_build",
      config_path: "../../config/config.exs",
      deps_path: "../../deps",
      lockfile: "../../mix.lock",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      elixirc_paths: elixirc_paths(Mix.env())
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger, :gproc],
      mod: {Engine.Application, []}
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:message_generator, in_umbrella: true, only: :test},
      {:amqp, "~> 1.5"},
      {:broadway, "~> 0.6.0"},
      {:broadway_rabbitmq, "~> 0.6.0"},
      {:httpoison, "~> 1.6"},
      {:polyline, "~> 1.2"},
      {:jason, "~> 1.2"},
      {:mix_test_watch, "~> 0.8", only: :dev, only: :test, runtime: false},
      {:math, "~> 0.4.0"},
      {:hackney, git: "https://github.com/benoitc/hackney.git", branch: "master", override: true},
      {:elixir_uuid, "~> 1.2"},
      {:gproc, "~> 0.8.0"},
      {:eventstore, "~> 1.1"},
      {:vex, "~> 0.8.0"}
    ]
  end

  defp elixirc_paths(:test), do: ["lib", "test/mocks"]
  defp elixirc_paths(_), do: ["lib", "mix_tasks"]
end
