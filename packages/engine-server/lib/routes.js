const _ = require('highland')
const moment = require('moment')
const engine = require('@iteam1337/engine')

const carsCache = {}
const bookingsCache = {}

function register(io) {
  io.on('connection', function(socket) {
    console.log('connection', carsCache)
    _.merge([_.values(carsCache), engine.cars.fork()])
      .doto(car => (carsCache[car.id] = car))
      .pick(['position', 'status', 'id', 'tail', 'zone', 'speed', 'bearing'])
      .doto(
        car =>
          (car.position = [
            car.position.lon,
            car.position.lat,
            car.position.date,
          ])
      )
      //.filter(car => car.position.speed > 90) // endast bilar över en viss hastighet
      //.ratelimit(100, 100)
      .batchWithTimeOrCount(1000, 2000)
      .errors(console.error)
      .each(cars => socket.volatile.emit('cars', cars))

    _.merge([_.values(bookingsCache), engine.bookings.fork()])
      .doto(booking => (bookingsCache[booking.id] = booking))
      .batchWithTimeOrCount(1000, 5)
      .errors(console.error)
      .each(bookings => socket.emit('bookings', bookings))
  })
}

module.exports = {
  register,
}
