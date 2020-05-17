defmodule Routes do
  def init do
    IO.puts("Initialize the cars SUBSCRIBER")

    {:ok, agent} = Agent.start_link(fn -> [] end)
    subscribe(agent)
    agent
  end

  defp decode(car) do
    car |> Poison.decode!(%{keys: :atoms})
  end

  defp subscribe(agent) do
    IO.puts("Subscribe for cars")

    spawn(fn ->
      exchange = "cars"
      queue = "routes"
      IO.puts("Now we create a #{queue} for cars exchange")
      {:ok, connection} = AMQP.Connection.open(Application.fetch_env!(:engine, :amqp_host))
      {:ok, channel} = AMQP.Channel.open(connection)
      AMQP.Exchange.declare(channel, exchange, :fanout)
      AMQP.Queue.declare(channel, queue)
      AMQP.Queue.bind(channel, queue, exchange)
      IO.puts("Now we bound the #{queue} to cars exchange")

      AMQP.Queue.subscribe(channel, queue, fn car, _meta ->
        # IO.puts("Now we have a message from routes queue")
        car_decoded = decode(car)
        # IO.puts("Got location for car #{car_decoded.id}")
        Agent.update(agent, fn cars -> cars ++ [Car.make(car_decoded)] end)
      end)
    end)
  end
end
