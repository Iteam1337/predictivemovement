defmodule MessageGenerator.MixProject do
  use Mix.Project

  def project do
    [
      app: :message_generator,
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

  def application do
    [
      env: [
        amqp_host: "localhost"
      ],
      extra_applications: [:logger],
      mod: {MessageGenerator.Application, []}
    ]
  end

  defp deps do
    [
      {:jason, "~> 1.2"},
      {:poison, "~> 3.1"},
      {:httpoison, "~> 1.6"},
      {:amqp, "~> 1.4"},
      {:hackney, git: "https://github.com/benoitc/hackney.git", branch: "master", override: true}
    ]
  end
end
