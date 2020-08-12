const _ = require('highland')
const {
  addVehicle,
  bookings,
  bookingsNewWithRoutes,
  cars,
  createBooking,
  dispatchOffers,
  createBookingsFromHistory,
  resetState,
} = require('./engineConnector')
const id62 = require('id62').default // https://www.npmjs.com/package/id62

const movingCarsCache = new Map()
const bookingsCache = new Map()

function register(io) {
  io.on('connection', function (socket) {
    _.merge([
      _(bookingsCache.values()),
      bookings.fork(),
      bookingsNewWithRoutes.fork(),
    ])
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
      .pick(['position', 'status', 'id', 'activities', 'current_route'])
      // .tap(updatePosition)
      .batchWithTimeOrCount(1000, 2000)
      .errors(console.error)
      .each((cars) => socket.emit('cars', cars))

    socket.on('new-booking', ({ pickup, delivery, ...rest }) => {
      const [pickupLat, pickupLon] = pickup
      const [deliveryLat, deliveryLon] = delivery

      const booking = {
        ...rest,
        id: rest.id || id62(),
        senderId: 'the-UI', // we can get either some sender id in the message or socket id and then we could emit messages - similar to notifications
        bookingDate: new Date().toISOString(),
        pickup: {
          lat: pickupLat,
          lon: pickupLon,
        },
        delivery: {
          lat: deliveryLat,
          lon: deliveryLon,
        },
      }

      createBooking(booking)
    })

    socket.on('dispatch-offers', () => {
      console.log('received message to dispatch offers, from UI')
      dispatchOffers()
    })

    socket.on('add-vehicle', ({ position }) => {
      addVehicle(position)
    })

    socket.on('new-bookings', ({ total }) => {
      console.log('will create ', total, 'bookings')
      createBookingsFromHistory(total)
    })

    socket.on('reset-state', () => {
      bookingsCache.clear()
      movingCarsCache.clear()
      resetState()
      socket.emit('cars', [])
      socket.emit('bookings', [])
    })
  })
}

module.exports = {
  register,
}
