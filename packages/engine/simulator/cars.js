/* eslint-disable no-undef */
const _ = require('highland')
const { randomize } = require('./address')
const Car = require('../lib/car')
//const positions = require('./positions')
const range = length => Array.from({ length }).map((value, i) => i)

function generateCar({ position, heading, id }) {
  const car = new Car(id, position)
  car.position = position
  car.navigateTo(position, heading)
  car.on('dropoff', () => {
    randomize().then(position => car.navigateTo(position))
  })

  return car
}

function generateRandomCar(id) {
  return _(
    Promise.all([randomize(), randomize()])
      .then(positions => generateCar({ positions, id }))
      .catch(err => console.error('simulation error', err))
  )
}

module.exports = {
  simulate: () =>
    _(range(50))
      .flatMap(generateRandomCar)
      .errors(err => console.error('initialize error', err))
      .map(car => _('moved', car))
      .errors(err => console.error('move error', err))
      .merge(),

  generate: generateCar,
}
