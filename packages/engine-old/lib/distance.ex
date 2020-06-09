defmodule Distance do
  @doc """
  Radius from degrees
  """
  def rad(x) do
    x * Math.pi() / 180
  end

  @doc """
  Calculate birds distance between two coordinates
  """
  def haversine(p1, p2) do
    radius = 6_371_000

    dLat = rad(p2.lat - p1.lat)
    dLong = rad(p2.lon - p1.lon)

    a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) * Math.sin(dLong / 2) *
          Math.sin(dLong / 2)

    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    d = radius * c

    Kernel.round(d)
  end

  def haversine(positions) do
    positions
    |> Enum.chunk_every(2, 1, :discard)
    |> Enum.reduce(0, fn [a, b | _rest], sum -> sum + haversine(a, b) end)
  end
end
