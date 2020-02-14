# const _ = require('highland')
# const { randomize } = require('./address')
# const Car = require('../lib/car')
# //const positions = require('./positions')
# const range = length => Array.from({ length }).map((value, i) => i)

# function generateCar({ positions, id }) {
#   const car = new Car(id, positions[0])
#   car.position = positions[0]
#   car.navigateTo(positions[1])
#   car.on('dropoff', () => {
#     randomize().then(position => car.navigateTo(position))
#   })

#   return car
# }

# function generateRandomCar(id) {
#   return _(
#     Promise.all([randomize(), randomize()])
#       .then(positions => generateCar({ positions, id }))
#       .catch(err => console.error('simulation error', err))
#   )
# }

# module.exports = {
#   simulate: () =>
#     _(range(50))
#       .flatMap(generateRandomCar)
#       .errors(err => console.error('initialize error', err))
#       .map(car => _('moved', car))
#       .errors(err => console.error('move error', err))
#       .merge(),

#   generate: generateCar,
# }

defmodule Cars do
  def generateRandomCar(id, center) do
    departure = Address.random(center)
    destination = Address.random(center)
    generateCar([departure, destination], id)
  end

  def generateCar([departure, destination], id) do
    Car.make(id, departure, false)
    |> Car.navigateTo(destination)
  end

  #   File.stream!("path/to/some/file")
  #     |> Flow.from_enumerable()
  #     |> Flow.flat_map(&String.split(&1, " "))
  #     |> Flow.partition()
  #     |> Flow.reduce(fn -> %{} end, fn word, acc ->
  #       Map.update(acc, word, 1, & &1 + 1)
  #   end)
  #   |> Enum.to_list()

  def simulate(center, size) do
    1..size
    |> Flow.from_enumerable()
    |> Flow.partition()
    |> Flow.map(fn x -> generateRandomCar(x, center) end)
    |> Enum.to_list()
  end
end
