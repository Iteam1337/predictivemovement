defmodule Graphhopper do
  @car %{
    type_id: "car",
    capacity: [
      10
    ],
    profile: "car"
  }

  @vehicle_types [
    @car
  ]

  def car_to_vehicle(%Car{id: vehicle_id, position: position}) do
    %{
      vehicle_id: vehicle_id |> to_string(),
      start_address: %{
        location_id: Enum.random(1..1_000_000) |> to_string(),
        lon: position.lon,
        lat: position.lat
      },
      return_to_depot: false,
      type_id: "car"
    }
  end

  def booking_to_shipment(%Booking{pickup: pickup, delivery: delivery, id: id}) do
    %{
      id: id |> to_string(),
      name: "pickup and deliver #{id}",
      pickup: %{
        address: %{
          location_id: Enum.random(1..10000) |> to_string(),
          lon: pickup.lon,
          lat: pickup.lat
        }
      },
      delivery: %{
        address: %{
          location_id: Enum.random(1..10000) |> to_string(),
          lon: delivery.lon,
          lat: delivery.lat
        }
      },
      size: [
        1
      ]
    }
  end

  def find_optimal_routes(cars, bookings) do
    vehicles = cars |> Enum.map(&car_to_vehicle/1)
    shipments = bookings |> Enum.map(&booking_to_shipment/1)

    payload = %{
      vehicles: vehicles,
      vehicle_types: @vehicle_types,
      shipments: shipments
    }

    Fetch.json_post(
      "https://graphhopper.com/api/1/vrp?key=85344d1b-4454-42df-b521-1be0f4fd2868",
      payload
    )
  end
end
