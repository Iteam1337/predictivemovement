const _ = require('highland')
//const price = require('./price')
const dispatch = require('./dispatch')
const carFinder = require('./carFinder')
/*
const $finder = newBookings.fork()
  .take(3)
  .tap(booking => console.log(`#${booking.id} - new booking. Looking for cars...`))
  .doto(booking => { booking.$fastestCars = carFinder(booking) })
  // .filter(booking => moment(booking.pickupDate).subtract(5, 'minutes').isAfter(new Date()))
  .tap(booking => {
    booking.$fastestCars.observe()
    .each(hit => console.log(`===========
      #${booking.id} ${booking.stopPoints[0].streetName}
      Found potential car in ${new Date() - booking.bookingDate} ms.
      The car #${hit.car.id} is ${hit.distance} meters away
      It would arrive in ${Math.ceil(hit.tta / 60)} minutes`))
  })

const $estimates = $finder.fork()
  .flatMap(booking => _(price.estimate(booking)))

  .errors(err => console.error('estimate', err))
  .tap(booking => booking.estimated && console.log(`
    Price: ${booking.estimated.price}kr
    Estimated time: ${Math.round(booking.estimated.duration / 60)} min
    Distance: ${Math.round(booking.estimated.distance / 1000)} km`))

const $assignments = $estimates.fork()
  .flatMap(booking => _(dispatch.assignCars(booking)))
  .errors(err => console.error('assign', err))

$assignments.fork()
  .each(trip => console.log(`
                Car #${trip.car.id} has accepted the booking and is on its way
                ============`))
*/

class Engine {
  constructor({ bookings, cars }) {
    this.bookings = bookings
    this.cars = cars
    this.possibleRoutes = this.bookings.fork().map(booking => ({
      booking,
      closestCars: carFinder(booking, this.cars.fork()),
    }))
    this.offers = this.possibleRoutes
      .observe()
      .flatMap(route => _(dispatch.assignCars(route)))
  }
}

module.exports = Engine
