defmodule Mix.Tasks.SetupTestDatabase do
  use Mix.Task

  @impl Mix.Task
  def run(_) do
    {:ok, _} = Application.ensure_all_started(:postgrex)
    {:ok, _} = Application.ensure_all_started(:ssl)

    config = [
      serializer: Engine.JsonSerializer,
      username: System.get_env("POSTGRES_USER") || "postgres",
      password: System.get_env("POSTGRES_PASSWORD") || "postgres",
      database: System.get_env("POSTGRES_DB") || "eventstore",
      hostname: System.get_env("POSTGRES_HOST") || "localhost",
      schema: "test",
      column_data_type: "jsonb"
    ]

    :ok = EventStore.Tasks.Create.exec(config, [])
    :ok = EventStore.Tasks.Init.exec(config)
    IO.puts("test database created & initiated")
  end
end
