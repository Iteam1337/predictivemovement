const _ = require('highland')
const {
  bookings,
  cars,
  bookings_delivered,
  bookings_assigned,
  createBooking,
} = require('./engineConnector')
const id62 = require('id62').default // https://www.npmjs.com/package/id62
// const engine = new Engine({
//   bookings: simulator.bookings,
//   cars: simulator.cars.simulate(),
// })

const movingCarsCache = new Map()
const bookingsCache = new Map()

// const bookings = engine.possibleRoutes
//   .fork()
//   .map(pr => pr.booking)
//   .errors(err => console.error(err))

// const cars = engine.possibleRoutes
//   .fork()
//   .flatMap(pr => pr.closestCars)
//   .errors(err => console.error(err))

// const candidates = possibleRoutes
//   .fork()
//   .flatMap(pr => pr.cars)
//   .errors(err => console.error(err))

// const movingCars = engine.cars.fork().errors(err => console.error(err))

// engine.cars.fork().each(car => console.log('car', car.id))
// engine.bookings.fork().each(booking => console.log('booking', booking.id))

function register(io) {
  io.on('connection', function (socket) {
    // _.merge([_(carsCache.values()), candidates.fork()])
    //   .filter(car => car.car.id)
    //   .doto(car => {
    //     carsCache.set(car.car.id, car)
    //   })
    //   .map(({ car, detour }) => ({ ...car, detour }))
    //   .pick([
    //     'position',
    //     'status',
    //     'id',
    //     'tail',
    //     'zone',
    //     'speed',
    //     'bearing',
    //     'detour',
    //     'heading',
    //   ])
    //   .batchWithTimeOrCount(1000, 2000)
    //   .errors(console.error)
    //   .each(cars => socket.volatile.emit('cars', cars))

    bookings_assigned
      .fork()
      .doto(({
        booking
      }) => bookingsCache.set(booking.id, booking))
      .doto(({
        car
      }) => movingCarsCache.set(car.id, car))
      .batchWithTimeOrCount(1000, 1000)
      .errors(console.error)
      .each((bookings) => {
        socket.emit('booking-assigned', bookings)
      })

    _.merge([_(bookingsCache.values()), bookings.fork()])
      .doto((booking) => bookingsCache.set(booking.id, booking))
      .batchWithTimeOrCount(1000, 1000)
      .errors(console.error)
      .each((bookings) => {
        socket.emit('bookings', bookings)
      })

    bookings_delivered
      .fork()
      .map((booking) => booking.booking)
      .doto(({
        id
      }) => bookingsCache.delete(id))
      .batchWithTimeOrCount(1000, 1000)
      .errors(console.error)
      .each((bookings) => {
        socket.emit('bookings_delivered', bookings)
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
      .each((cars) => socket.emit('moving-cars', cars))

    socket.on('new-booking', ({
      pickup,
      dropoff
    }) => {
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