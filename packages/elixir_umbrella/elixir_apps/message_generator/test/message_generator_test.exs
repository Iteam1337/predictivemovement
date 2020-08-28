# defmodule MessageGeneratorTest do
#   use ExUnit.Case
#   doctest MessageGenerator
#   @rmq_uri "amqp://localhost"
#   @stockholm %{lat: 59.3414072, lon: 18.0470482}
#   @gothenburg %{lat: 57.7009147, lon: 11.7537571}
#   @cars_exchange "cars"
#   @bookings_exchange "bookings"

#   @kungstradgarden %{lat: 59.332632, lon: 18.071692}
#   @iteam %{lat: 59.343664, lon: 18.069928}
#   @ralis %{lat: 59.330513, lon: 18.018228}
#   @alvik %{lat: 59.3312804, lon: 17.9753744}
#   @bromma %{lat: 59.3417938, lon: 17.9028741}
#   @slussen %{lat: 59.3166939, lon: 18.0669377}

#   @iteamToRalis %{
#     pickup: @iteam,
#     delivery: @ralis,
#     id: "iteamToRalis"
#   }

#   @alvikToBromma %{
#     pickup: @alvik,
#     delivery: @bromma,
#     id: "alvikToBromma"
#   }

#   @volvo %{
#     id: "volvo",
#     position: @slussen
#   }

#   test "generates a booking" do
#     {:ok, connection} = AMQP.Connection.open(@rmq_uri)
#     {:ok, channel} = AMQP.Channel.open(connection)

#     # normal order
#     # pickup first -> pickup second -> deliver second -> deliver first

#     # add 2 days to pickup for first
#     pickupEarliest =
#       DateTime.utc_now()
#       |> DateTime.add(60 * 60 * 24 * 2)

#     # 2 days and 2 hours in the future
#     pickupLatest =
#       pickupEarliest
#       |> DateTime.add(60 * 60 * 2)

#     first_booking =
#       @iteamToRalis
#       |> MessageGenerator.add_random_id_and_time()
#       |> Map.put(:metadata, %{external_id: "first booking"})
#       |> Map.update!(
#         :pickup,
#         &Map.merge(&1, %{
#           time_windows: [%{earliest: pickupEarliest, latest: pickupLatest}]
#         })
#       )
#       |> Poison.encode!()

#     second_booking =
#       @alvikToBromma
#       |> MessageGenerator.add_random_id_and_time()
#       |> Map.put(:metadata, %{external_id: "second booking"})
#       |> Map.update!(
#         :pickup,
#         &Map.merge(&1, %{
#           time_windows: [
#             %{earliest: DateTime.utc_now(), latest: DateTime.utc_now() |> DateTime.add(15000)}
#           ]
#         })
#       )
#       |> Poison.encode!()

#     car =
#       @volvo
#       |> Poison.encode!()

#     AMQP.Basic.publish(channel, @bookings_exchange, "new", first_booking)
#     AMQP.Basic.publish(channel, @bookings_exchange, "new", second_booking)
#     AMQP.Basic.publish(channel, @cars_exchange, "", car)
#   end
# end
