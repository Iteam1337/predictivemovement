const _ = require('highland')
const { bookings, cars, createBooking } = require('./engineConnector')
const id62 = require('id62').default // https://www.npmjs.com/package/id62

const movingCarsCache = new Map()
const bookingsCache = new Map()

function register(io) {
  io.on('connection', function (socket) {
    _.merge([_(bookingsCache.values()), bookings.fork()])
      .doto((booking) => bookingsCache.set(booking.id, booking))
      .batchWithTimeOrCount(1000, 1000)
      .errors(console.error)
      .each((bookings) => {
        socket.emit('bookings', bookings)
      })

    _.merge([_(movingCarsCache.values()), cars.fork()])
      .filter((car) => car.id)
      .doto((car) => {
        movingCarsCache.set(car.id, car)
      })
      .pick([
        'position',
        'status',
        'id',
        'tail',
        'zone',
        'speed',
        'bearing',
        'heading',
      ])
      // .tap(updatePosition)
      .batchWithTimeOrCount(1000, 2000)
      .errors(console.error)
      .each((cars) => socket.emit('cars', cars))

    socket.on('new-booking', ({ pickup, dropoff }) => {
      const [pickupLat, pickupLon] = pickup
      const [dropoffLat, dropoffLon] = dropoff

      const booking = {
        id: id62(),
        senderId: 'the-UI', // we can get either some sender id in the message or socket id and then we could emit messages - similar to notifications
        bookingDate: new Date().toISOString(),
        departure: {
          lat: pickupLat,
          lon: pickupLon,
        },
        destination: {
          lat: dropoffLat,
          lon: dropoffLon,
        },
      }

      createBooking(booking)
    })
  })
}

module.exports = {
  register,
}
