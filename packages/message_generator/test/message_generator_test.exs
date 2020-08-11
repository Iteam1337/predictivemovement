defmodule MessageGeneratorTest do
  use ExUnit.Case
  doctest MessageGenerator
  @rmq_uri "amqp://localhost"
  @stockholm %{lat: 59.3414072, lon: 18.0470482}
  @gothenburg %{lat: 57.7009147, lon: 11.7537571}
  @cars_exchange "cars"
  @bookings_exchange "bookings"

  test "generates a booking" do
    {:ok, connection} = AMQP.Connection.open(@rmq_uri)
    {:ok, channel} = AMQP.Channel.open(connection)

    first_booking =
      MessageGenerator.random_booking(@stockholm)
      |> Map.put(:metadata, %{external_id: "first booking"})
      |> Map.update!(:pickup, &Map.merge(&1, %{time_windows: [%{earliest: 1000, latest: 5000}]}))
      |> Map.update!(
        :delivery,
        &Map.merge(&1, %{time_windows: [%{earliest: 4000, latest: 6000}]})
      )
      |> Poison.encode!()

    second_booking =
      MessageGenerator.random_booking(@stockholm)
      |> Map.put(:metadata, %{external_id: "second booking"})
      |> Map.update!(:pickup, &Map.merge(&1, %{time_windows: [%{earliest: 6000, latest: 15000}]}))
      |> Poison.encode!()

    car =
      MessageGenerator.random_car(@stockholm)
      |> Poison.encode!()

    AMQP.Basic.publish(channel, @bookings_exchange, "new", first_booking)
    AMQP.Basic.publish(channel, @bookings_exchange, "new", second_booking)
    AMQP.Basic.publish(channel, @cars_exchange, "", car)
  end
end
