defmodule ElixirUmbrella.MixProject do
  use Mix.Project

  def project do
    [
      aliases: aliases(),
      apps_path: "apps",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      config_path: "config/config.exs",
      version: "0.1.0",
      releases: [
        engine_umbrella: [
          applications: [
            engine: :permanent
          ]
        ]
      ]
    ]
  end

  def aliases do
    [dev: ["event_store.create", "event_store.init", &run_app_in_shell/1]]
  end

  def run_app_in_shell(_), do: Mix.shell().cmd("iex -S mix")

  def application do
    [extra_applications: [:logger, :gproc]]
  end

  defp deps do
    []
  end
end
