defmodule CarFinder do
  def rad(x) do
    x * Math.PI / 180
  end

  def haversine(p1, p2) do
    R = 6_371_000
    dLat = rad(p2.lat - p1.lat)
    dLong = rad(p2.lon - p1.lon)

    a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2)

    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    d = R * c

    Math.round(d)
  end

  def distance(car, booking) do
    haversine(car["position"], booking["departure"])
  end

  def find(booking, cars) do
    cars
    |> Enum.map(distance!(booking))
  end
end
