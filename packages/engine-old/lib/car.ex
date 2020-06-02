# iex> defmodule User do
#   ...>   defstruct name: "John", age: 27
#   ...> end

# const car = new Car(32, { lat: 21312, lon: 321321})

defmodule Car do
  defstruct id: 0,
            position: %{lon: 53, lat: 14},
            heading: nil,
            busy: false,
            instructions: [],
            route: nil

  def make(%{id: id, position: position, heading: nil}), do: make(id, position, false)
  def make(%{id: id, position: position}), do: make(id, position, false)

  def make(%{id: id, position: position, heading: heading}),
    do: make(id, position, false) |> navigateTo(heading)

  def make(id, position, busy) do
    %Car{id: id, position: position, busy: busy}
  end

  def navigate(car) do
    car
    |> Map.put(
      :route,
      Osrm.route(Enum.map(car.instructions, fn x -> x.position end))
      |> Map.put(:started, NaiveDateTime.utc_now())
    )
    |> Map.put(:heading, List.first(car.instructions))
  end

  def navigateTo(car, heading), do: navigateTo(car, heading, [])

  def navigateTo(car, heading, next) do
    route =
      Osrm.route(car.position, heading)
      |> Map.put(:started, NaiveDateTime.utc_now())

    heading = Map.put(heading, :route, route)

    car
    |> Map.put(:heading, heading)
    |> Map.put(:route, route)
    |> Map.put(:next, next)

    # |> Map.put(:routes, car.routes ++ [route])
  end

  def position(car), do: position(car, NaiveDateTime.utc_now())

  def position(%{route: nil, position: %{lat: lat, lon: lon}}, _time) do
    %{lat: lat, lon: lon}
  end

  def position(%{route: route}, time) do
    relative_time = NaiveDateTime.diff(time, route.started)
    #### In the tests we get 0
    # Interpolate.get_position_from_route(route, relative_time)
    Interpolate.get_position_from_route(route, relative_time + 1)
  end

  # offer_booking -> assign_booking -> assign_booking()

  def assign(car, booking, :auto) do
    car
    |> calculateDetours(booking)
    |> List.first()
    |> case do
      %{before: nil, after: nil} ->
        assign(car, booking, 0)

      # The last element of an instruction segment
      %{before: nil, after: afterPosition} ->
        index =
          Enum.find_index(car.instructions, fn i ->
            i.position == afterPosition
          end)
          |> Kernel.+(1)

        assign(car, booking, index)

      %{before: before, after: _after} ->
        before_index =
          Enum.find_index(car.instructions, fn i ->
            i.position == before
          end)

        assign(car, booking, before_index)
    end
  end

  def assign(car, booking), do: assign(car, booking, length(car.instructions))
  def assign(car, booking, index), do: assign(car, booking, index, index + 1)

  def assign(car, booking, pickup_index, dropoff_index) do
    car
    |> Map.update!(:instructions, fn instructions ->
      List.insert_at(instructions, pickup_index, %{
        action: :pickup,
        position: booking.departure,
        booking: booking
      })
    end)
    |> Map.update!(:instructions, fn instructions ->
      List.insert_at(instructions, dropoff_index, %{
        action: :dropoff,
        position: booking.destination,
        booking: booking
      })
    end)
    |> navigate()
  end

  def assign(%{car: car, booking: booking}) do
    # next = calculatDetours(car, booking)
    # reroute(car, next)
    next = [booking.destination, car.position]

    navigateTo(car, booking.departure, next)
    |> Map.put(:busy, true)
  end

  def calculateDetours(%{instructions: [], position: position}, %{
        departure: departure,
        destination: destination
      }) do
    [
      %{
        # rather assign a car with same pickup and destination before assigning it to an empty car
        detourDiff: Distance.haversine([position, departure, destination]),
        before: nil,
        after: nil
      }
    ]
  end

  def calculateDetours(%{instructions: instructions, route: route}, booking) do

    instructions
    # returns pairs, i.e [a, b, c, d] -> [[a, b], [b, c], [c, d]]
    |> Enum.chunk_every(2, 1, :discard)
    |> Enum.flat_map(fn [%{position: a} | [%{position: b} | _rest]] ->
      [
        %{
          positions: [a, b, booking.departure, booking.destination],
          before: nil,
          after: b
        },
        %{
          positions: [booking.departure, booking.destination, a, b],
          before: a,
          after: nil
        },
        %{
          positions: [a, booking.departure, booking.destination, b],
          before: b,
          after: a
        }
      ]
      |> Enum.map(fn modifier ->
        %{
          detourDiff: Distance.haversine(modifier.positions) - Distance.haversine(a, b),
          before: modifier.before,
          after: modifier.after
        }
      end)

      # |> Enum.map(fn modifier -> Map.put(modifier, :score, Score.calculate(booking,  %{ route: route }, modifier.route)) end)
    end)
    |> Enum.sort_by(fn a -> a.detourDiff end, :asc)
  end

  def offer(car, booking) do
    ask_car = fn car, booking ->
      MQ.publish_rpc(
        %{car: %{id: car.id}, booking: booking},
        Application.fetch_env!(:engine, :pickup_offers_queue),
        Application.fetch_env!(:engine, :pickup_response_queue)
      )
    end

    offer(car, booking, ask_car)
  end

  def offer(car, booking, ask_car) do
    accepted = ask_car.(car, booking)
    %{car: car, booking: booking, accepted: accepted}
  end
end
