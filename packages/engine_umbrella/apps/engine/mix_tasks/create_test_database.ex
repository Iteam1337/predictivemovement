defmodule Mix.Tasks.SetupTestDatabase do
  use Mix.Task

  @impl Mix.Task
  def run(_) do
    {:ok, _} = Application.ensure_all_started(:postgrex)
    {:ok, _} = Application.ensure_all_started(:ssl)

    config = [
      serializer: Engine.JsonSerializer,
      username: "postgres",
      password: "postgres",
      database: "eventstore",
      hostname: "localhost",
      schema: "test"
    ]

    :ok = EventStore.Tasks.Create.exec(config, [])
    :ok = EventStore.Tasks.Init.exec(Engine.ES, config, [])
    IO.puts("test database created & initiated")
  end
end
