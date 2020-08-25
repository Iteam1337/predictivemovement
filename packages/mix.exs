defmodule KvUmbrella.MixProject do
  use Mix.Project

  def project do
    [
      apps_path: "elixir_apps",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      config_path: "elixir_config/config.exs"
    ]
  end

  defp deps do
    []
  end
end
