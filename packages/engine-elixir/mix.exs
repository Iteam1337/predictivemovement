defmodule Engine.MixProject do
  use Mix.Project

  def project do
    [
      app: :engine,
      version: "0.1.0",
      elixir: "~> 1.10",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      aliases: aliases()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      env: [amqp_host: "amqp://localhost", bookings_exchange: "bookings", cars_exchange: "cars"],
      extra_applications: [:lager, :logger],
      mod: {Engine, []}
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:math, "~> 0.4.0"},
      {:amqp, "~> 1.0"},
      {:flow, "~> 1.0.0"},
      {:jaxon, "~> 1.0"},
      {:mix_test_watch, "~> 0.8", only: :dev, only: :test, runtime: false},
      {:httpoison, "~> 1.6"},
      {:poison, "~> 3.1"},
      {:polyline, "~> 1.2"},
      {:stream_data, "~> 0.1", only: :test}
    ]
  end

  defp aliases do
    [
      start: "run --no-halt",
      test: "test --no-start",
      "test.watch": "test.watch --no-start"
    ]
  end
end
