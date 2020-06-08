defmodule Engine.MixProject do
  use Mix.Project

  def project do
    [
      app: :engine,
      version: "0.1.0",
      elixir: "~> 1.10",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      elixirc_paths: elixirc_paths(Mix.env())
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      env: [
        amqp_host: "localhost",
        bookings_exchange: "bookings",
        cars_exchange: "cars",
        candidates_exchange: "candidates",
        booking_requests_queue: "booking_requests",
        routes_queue: "routes",
        pickup_offers_queue: "pickup_offers",
        # TODO: Rename when we update message size in Telegram
        pickup_response_queue: "p_response",
        booking_assignments_exchange: "booking_assignments",
        booking_updates_queue: "booking_updates",
        osrm_url: "https://osrm.iteamdev.io"
      ],
      extra_applications: [:logger],
      mod: {Engine.Application, []}
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:amqp, "~> 1.0"},
      {:flow, "~> 1.0.0"},
      {:broadway, "~> 0.6.0"},
      {:broadway_rabbitmq, "~> 0.6.0"},
      {:httpoison, "~> 1.6"},
      {:polyline, "~> 1.2"},
      {:jason, "~> 1.2"},
      {:mix_test_watch, "~> 0.8"},
      {:math, "~> 0.4.0"},
      {:mox, "~> 0.5"},
      {:poison, "~> 3.1"},
      {:hackney, git: "https://github.com/benoitc/hackney.git", branch: "master", override: true}
      # {:dep_from_hexpm, "~> 0.3.0"},
      # {:dep_from_git, git: "https://github.com/elixir-lang/my_dep.git", tag: "0.1.0"}
    ]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "test/mocks"]
  defp elixirc_paths(_), do: ["lib"]
end
