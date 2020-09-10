const _ = require('highland')
const {
  addVehicle,
  bookings,
  cars,
  createBooking,
  dispatchOffers,
  createBookingsFromHistory,
  resetState,
  plan,
  deleteBooking,
} = require('./engineConnector')
const id62 = require('id62').default // https://www.npmjs.com/package/id62

const movingCarsCache = new Map()
const bookingsCache = new Map()
const planCache = new Map()

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
      // .pick(['position', 'status', 'id', 'activities', 'current_route'])
      // .tap((car) => car)
      .batchWithTimeOrCount(1000, 2000)
      .errors(console.error)
      .each((cars) => socket.emit('cars', cars))

    _.merge([_(planCache.values()), plan.fork()])
      .doto((data) => {
        planCache.set('plan', data)
      })
      .each((data) => socket.emit('plan-update', data))

    socket.on('new-booking', (params) => {
      const booking = {
        id: params.id || id62(),
        senderId: 'the-UI', // we can get either some sender id in the message or socket id and then we could emit messages - similar to notifications
        bookingDate: new Date().toISOString(),
        size: {
          measurement: params.measurement,
          weight: params.weight,
        },
        pickup: {
          time_windows: params.pickup.timewindows,
          lat: params.pickup.lat,
          lon: params.pickup.lon,
        },
        delivery: {
          time_windows: params.delivery.timewindows,
          lat: params.delivery.lat,
          lon: params.delivery.lon,
        },
        metadata: {
          sender: params.sender,
          recipient: params.recipient,
        },
      }

      createBooking(booking)
    })

    socket.on('dispatch-offers', () => {
      console.log('received message to dispatch offers, from UI')
      dispatchOffers()
    })

    socket.on('add-vehicle', (params) => {
      const vehicle = {
        id: params.id || id62(),
        capacity:
          params.volume && params.weight
            ? {
                volume: parseInt(params.volume, 10),
                weight: parseInt(params.weight, 10),
              }
            : null,
        earliest_start: params.timewindow.start,
        latest_end: params.timewindow.end,
        start_address: params.startPosition,
        end_address: params.endDestination
          ? params.endDestination
          : params.startPosition,

        metadata: {
          driver: params.driver,
          profile: params.vehicleType,
        },
      }
      addVehicle(vehicle)
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

    socket.on('delete-booking', (id) => {
      bookingsCache.delete(id)
      deleteBooking(id)
    })
  })
}

module.exports = {
  register,
}
