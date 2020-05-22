defmodule BroadwayEngine.MatchProducer do
  use GenStage
  alias Broadway.Message

  @rmq_uri "amqp://localhost"
  @cars_exchange "cars"
  @bookings_exchange "bookings"

  @available_cars_queue_name "routes"
  @available_bookings_queue_name "booking_requests"

  def start_link() do
    GenStage.start_link(BroadwayEngine.MatchProducer, %{})
  end

  def init(_) do
    create_rmq_resources()
    {:producer, %{cars: [], bookings: []}}
  end

  def handle_info({:basic_consume_ok, _}, state) do
    {:noreply, [], state}
  end

  def handle_info({:basic_deliver, car, %{exchange: @cars_exchange}}, %{
        cars: cars,
        bookings: bookings
      }) do
    IO.puts("new car!")

    car = string_to_car_transform(car)

    dispatch_events([car | cars], bookings)
  end

  def handle_info(
        {:basic_deliver, booking, %{exchange: @bookings_exchange, routing_key: "new"}},
        %{
          cars: cars,
          bookings: bookings
        }
      ) do
    IO.puts("new booking!")
    booking = string_to_booking_transform(booking)
    dispatch_events(cars, [booking | bookings])
  end

  def dispatch_events(cars, [] = _bookings), do: {:noreply, [], %{bookings: [], cars: cars}}

  def dispatch_events(cars, bookings) when length(cars) < 2,
    do: {:noreply, [], %{bookings: bookings, cars: cars}}

  def dispatch_events(cars, bookings) do
    [latest_booking | bookings] = bookings

    message = %Message{
      data: {cars, latest_booking},
      acknowledger: {__MODULE__, :ack_id, :ack_data}
    }

    {:noreply, [message], %{bookings: bookings, cars: cars}}
  end

  def handle_demand(_demand, state) do
    {:noreply, [], state}
  end

  def ack(_ack_ref, _successful, _failed) do
    :ok
  end

  def string_to_car_transform(car_string) do
    car_string
    |> Poison.decode!(keys: :atoms!)
    |> Map.get(:position)
    |> (fn position -> Car.make(1, position) end).()
  end

  def string_to_booking_transform(booking_string) do
    decoded = Poison.decode!(booking_string, keys: :atoms)

    %Booking{}
    |> Map.put(:pickup, decoded.departure)
    |> Map.put(:delivery, decoded.destination)
    # TODO: Add correct id
    |> Map.put(:id, Enum.random(0..10000))
  end

  defp create_rmq_resources do
    # Setup RabbitMQ connection
    {:ok, connection} = AMQP.Connection.open(@rmq_uri)
    {:ok, channel} = AMQP.Channel.open(connection)

    # Create exchange
    AMQP.Exchange.fanout(channel, @cars_exchange, durable: false)
    AMQP.Exchange.declare(channel, @bookings_exchange, :topic, durable: false)

    # Create queues
    AMQP.Queue.declare(channel, @available_cars_queue_name, durable: false)
    AMQP.Queue.declare(channel, @available_bookings_queue_name, durable: false)

    # Bind queues to exchange
    AMQP.Queue.bind(channel, @available_cars_queue_name, @cars_exchange,
      routing_key: @available_cars_queue_name
    )

    AMQP.Queue.bind(channel, @available_bookings_queue_name, @bookings_exchange,
      routing_key: "new"
    )

    AMQP.Basic.consume(channel, @available_cars_queue_name, nil, no_ack: true)
    AMQP.Basic.consume(channel, @available_bookings_queue_name, nil, no_ack: true)
  end
end
