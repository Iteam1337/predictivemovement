ExUnit.start()

defmodule TestHelper do
  def wait_for_message(channel),
    do:
      wait_for_x_messages(1, channel)
      |> List.first()

  def wait_for_x_messages(x, channel),
    do: do_wait_for_x_messages([], channel, "", x)

  defp do_wait_for_x_messages(messages, channel, consumer_tag, 0) do
    AMQP.Basic.cancel(channel, consumer_tag)
    messages
  end

  defp do_wait_for_x_messages(messages, channel, consumer_tag, x) do
    receive do
      {:basic_deliver, payload, %{consumer_tag: ^consumer_tag}} ->
        decoded =
          payload
          |> Jason.decode!(%{keys: :atoms})

        messages
        |> List.insert_at(-1, decoded)
        |> do_wait_for_x_messages(channel, consumer_tag, x - 1)

      {:basic_consume_ok, %{consumer_tag: consumer_tag}} ->
        do_wait_for_x_messages(messages, channel, consumer_tag, x)

      _ ->
        do_wait_for_x_messages(messages, channel, consumer_tag, x)
    end
  end

  def clear_state(_context) do
    Engine.VehicleStore.clear()
    Engine.BookingStore.clear()
  end
end
