defmodule Engine.RedisAdapter do
  def add_booking(booking) do
    updated_bookings =
      get_bookings()
      |> List.insert_at(0, booking)
      |> Poison.encode!()

    Redix.command(:redix, ["SET", "bookings", updated_bookings])
  end

  def get_bookings() do
    {:ok, bookings} = Redix.command(:redix, ["GET", "bookings"])

    if is_nil(bookings), do: [], else: bookings |> Poison.decode!()
  end

  def add_vehicle(vehicle) do
    updated_vehicles =
      get_vehicles()
      |> List.insert_at(0, vehicle)
      |> Poison.encode!()

    Redix.command(:redix, ["SET", "vehicles", updated_vehicles])
  end

  def get_vehicles() do
    {:ok, vehicles} = Redix.command(:redix, ["GET", "vehicles"])

    if is_nil(vehicles), do: [], else: vehicles |> Poison.decode!()
  end
end
