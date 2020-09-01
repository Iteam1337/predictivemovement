defmodule ElixirUmbrella.MixProject do
  use Mix.Project

  def project do
    [
      apps_path: "elixir_apps",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      config_path: "config/config.exs",
      version: "0.1.0",
      releases: [
        elixir_umbrella: [
          applications: [
            engine: :permanent
          ]
        ]
      ]
    ]
  end

  def application do
    [extra_applications: [:logger, :gproc]]
  end

  defp deps do
    []
  end
end
