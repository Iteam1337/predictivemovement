defmodule Hellowordl.MixProject do
  use Mix.Project

  def project do
    [
      app: :hellowordl,
      version: "0.1.0",
      elixir: "~> 1.10",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger]
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:flow, "~> 1.0.0"},
      {:jaxon, "~> 1.0"},
      {:mix_test_watch, "~> 0.8", only: :dev, only: :test},
      {:httpoison, "~> 1.6"},
      {:poison, "~> 3.1"},
      {:polyline, "~> 1.2"}
    ]
  end
end
