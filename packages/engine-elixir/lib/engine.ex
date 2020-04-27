defmodule Engine.Supervisor do
  use Supervisor

  def start_link(init_arg) do
    Supervisor.start_link(__MODULE__, init_arg, name: __MODULE__)
  end

  @impl true
  def init(_init_arg) do
    children = [Engine.App]

    Supervisor.init(children, strategy: :one_for_one)
  end
end

defmodule Engine.App do
  use Task

  @chunk_size 1

  def start_link(_arg) do
    Task.start_link(__MODULE__, :start, _arg)
  end

  defp score(booking, car, detour) do
    # TODO: change to using Score.calculate instead
    %{booking: booking, car: car, score: detour.diff}
  end



  def start() do
    cars_stream = Routes.init()
    bookings_stream = BookingRequests.init()

    batch_of_bookings =
      bookings_stream
      # time window every minute?
      |> Stream.chunk_every(@chunk_size)

    batch_of_cars =
      cars_stream
      # sliding window of ten minutes?
      |> Stream.chunk_every(@chunk_size)

    find_and_offer_cars(batch_of_bookings, batch_of_cars, &Car.offer/2)
    |> Stream.run()
  end
end
