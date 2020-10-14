defmodule Engine.ES do
  use EventStore, otp_app: :engine
  alias EventStore.EventData

  @stream "event_stream"

  def init(config) do
    {:ok, config}
  end

  defp get_stream_version do
    case stream_forward(@stream) do
      {:error, :stream_not_found} ->
        0

      stream ->
        stream
        |> Enum.to_list()
        |> length()
    end
  end

  def add_event(event) do
    events = [
      %EventData{
        data: event
      }
    ]

    @stream
    |> append_to_stream(get_stream_version(), events)
  end

  def get_events() do
    case read_stream_forward(@stream) do
      {:error, :stream_not_found} -> []
      {:ok, events} -> events |> Enum.map(fn e -> e.data end)
    end
  end
end
