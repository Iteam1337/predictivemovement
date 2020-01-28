const _ = require('highland')
const engine = require('@iteam1337/engine')

const carsCache = new Map()
const bookingsCache = new Map()

const bookings = engine.possibleRoutes
  .fork()
  .map(pr => pr.booking)
  .errors(err => console.error(err))

const cars = engine.possibleRoutes
  .fork()
  .flatMap(pr => pr.closestCars)
  .errors(err => console.error(err))

// engine.cars.fork().each(car => console.log('car', car.id))
// engine.bookings.fork().each(booking => console.log('booking', booking.id))

function register (io) {
  io.on('connection', function (socket) {
    _.merge([_(carsCache.values()), cars.fork()])
      .doto(car => carsCache.set(car.id, car))
      .pick(['position', 'status', 'id', 'tail', 'zone', 'speed', 'bearing'])
      .doto(
        car =>
          (car.position = [
            car.position.lon,
            car.position.lat,
            car.position.date,
          ])
      )
      .batchWithTimeOrCount(1000, 2000)
      .errors(console.error)
      .each(cars => socket.volatile.emit('cars', cars))

    _.merge([_(bookingsCache.values()), bookings.fork()])
      .doto(booking => bookingsCache.set(booking.id, booking))
      .batchWithTimeOrCount(1000, 5)
      .errors(console.error)
      .each(bookings => socket.emit('bookings', bookings))
  })
}

module.exports = {
  register,
}
