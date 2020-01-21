const _ = require('highland')
const address = require('./address')
const Car = require('../lib/car')
//const positions = require('./positions')
const range = length => Array.from({length})
const positions = [range(1000).map(async (_, i) => {
    const pos = await address()
    console.log('pos', pos)
    return ({
      callsign: i,
      status: 'F',
      lat: pos.lat,
      lng: pos.lon
    })
  })]

function start (position) {
  console.log('start car', position)
  return _(Promise.all([address({ lat: position.lat, lon: position.lng }), address(/*random*/)])
  .then(fromTo => {
    const car = new Car(position.callsign, fromTo[0], position.status)
    car.busy = position.status === 'F'
    if (car.busy) {
      car.pickupLocation = fromTo[0]
      car.pickupDateTime = new Date()
    }
    car.position = fromTo[0]
    car.navigateTo(fromTo[1])
    cars.push(car)
    console.log('initiated car', car.id)
    return car
  })
  .catch(err => console.error('simulation error', err)))
}

module.exports = _(positions)
  .take(10)
  .flatMap(start)
  .errors(err => console.error('initialize error', err))
  .map(car => _('moved', car))
  .errors(err => console.error('move error', err))
  .merge()
