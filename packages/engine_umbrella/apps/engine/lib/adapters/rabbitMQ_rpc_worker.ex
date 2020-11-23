defmodule Engine.Adapters.RMQRPCWorker do
  use GenServer
  require Logger
  alias AMQP.{Queue, Channel, Basic}
  alias Engine.Adapters.RMQ

  def init(_) do
    RMQ.get_connection()
  end

  def call(data, queue, timeout \\ 20000) do
    {:ok, pid} = GenServer.start_link(__MODULE__, [])

    try do
      {:ok, GenServer.call(pid, {:call, data, queue}, timeout)}
    catch
      :exit, {:timeout, _} ->
        Logger.error("RPC call to #{queue} timed out")
        {:error, :timeout}
    end
  end

  def handle_call({:call, data, queue}, _from, conn) do
    {:ok, channel} = Channel.open(conn)

    {:ok, %{queue: queue_name}} =
      Queue.declare(
        channel,
        "",
        exclusive: true,
        auto_delete: true
      )

    Basic.consume(channel, queue_name, nil, no_ack: false)
    Logger.info("Engine wants response from #{queue} to #{queue_name}")

    correlation_id =
      :erlang.unique_integer()
      |> :erlang.integer_to_binary()
      |> Base.encode64()

    start_of_rpc = Time.utc_now()

    Basic.publish(
      channel,
      "",
      queue,
      Jason.encode!(data),
      reply_to: queue_name,
      correlation_id: correlation_id,
      persistent: true
    )

    msg = wait_for_messages(channel, correlation_id)

    Logger.info(
      "Engine got response from #{queue_name} for #{queue}, which took #{
        Time.diff(Time.utc_now(), start_of_rpc)
      } seconds"
    )

    {:stop, :normal, msg, conn}
  end

  defp wait_for_messages(channel, correlation_id) do
    receive do
      {:basic_deliver, payload, %{correlation_id: ^correlation_id} = msg} ->
        Queue.unsubscribe(channel, Map.get(msg, :consumer_tag))
        payload

      _ ->
        wait_for_messages(channel, correlation_id)
    end
  end

  def handle_info({:basic_cancel_ok, _}, state), do: {:noreply, state}
end
