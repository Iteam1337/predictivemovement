defmodule Engine.ReleaseTasks do
  def init_event_store do
    {:ok, _} = Application.ensure_all_started(:postgrex)
    {:ok, _} = Application.ensure_all_started(:ssl)


    config = Engine.ES.config()

    :ok = EventStore.Tasks.Create.exec(config, [])
    :ok = EventStore.Tasks.Init.exec(Engine.ES, config, [])
  end
end
