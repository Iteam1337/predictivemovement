defmodule Engine.MixProject do
  use Mix.Project

  def project do
    [
      app: :engine,
      version: "0.1.0",
      elixir: "~> 1.10",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger],
      mod: {Engine.Application, []}
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:flow, "~> 1.0.0"},
      {:broadway, "~> 0.6.0"},
      {:broadway_rabbitmq, "~> 0.6.0"},
      {:httpoison, "~> 1.6"},
      {:polyline, "~> 1.2"},
      {:jason, "~> 1.2"},
      {:mix_test_watch, "~> 0.8"},
      {:math, "~> 0.4.0"},
      {:poison, "~> 3.1"},
      {:hackney, git: "https://github.com/benoitc/hackney.git", branch: "master", override: true}
      # {:dep_from_hexpm, "~> 0.3.0"},
      # {:dep_from_git, git: "https://github.com/elixir-lang/my_dep.git", tag: "0.1.0"}
    ]
  end
end
