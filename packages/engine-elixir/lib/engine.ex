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

  @chunk_size 2

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

    # todo: add date field to the booking
    booking_window = Flow.Window.fixed(1, :minute, fn _booking -> NaiveDateTime.utc_now() end)
    # todo: add date field to car position update
    car_window = Flow.Window.fixed(1, :minute, fn _car -> NaiveDateTime.utc_now() end)

    batch_of_bookings =
      bookings_stream
      # time window every minute?
      |> Flow.from_enumerable()
      |> Flow.partition(window: booking_window, stages: 1, max_demand: 5)

    # |> Stream.chunk_every(@chunk_size)

    batch_of_cars =
      cars_stream
      # sliding window of ten minutes?
      |> Flow.from_enumerable()
      |> Flow.partition(window: car_window, stages: 1, max_demand: 5)

    # |> Stream.chunk_every(@chunk_size)

    Dispatch.find_and_offer_cars(
      batch_of_bookings,
      batch_of_cars,
      &Car.offer/2,
      &Booking.assign/2
    )
    |> Stream.run()
  end
end
