const carPositions = require('../simulator/cars')
const carsCache = new Map()
const distance = require('./distance')
const { route, trip } = require('./osrm')
const _ = require('highland')

_(carPositions)
  .fork()
  .filter(car => car)
  .each(car => {
    carsCache.set(car.id, car)
  })

function estimateTimeToArrival(car, destination) {
  return route(car.position, destination)
    .then(route => {
      return {
        distance: route.distance,
        route: route,
        tta: route.duration || 9999,
        car: car
      }
    })
    .catch(err => console.error('estimated route', err))
}

const closestCars = (booking, within = 5000) =>
  _.pipeline(cars =>
    cars
      .map(car => ({
        distance: distance.haversine(car.position, booking.departure),
        car: car
      }))
      .take(50)
      // .filter(hit => hit.distance < within)
      .sortBy((a, b) => a.distance - b.distance)
      .map(hit => hit.car)
      // .filter(car => !car.busy)
      .errors(err => console.error('closestCars', err))
  )

const fastestCars = booking =>
  _.pipeline(cars =>
    cars
      .ratelimit(5, 500)
      .flatMap(car => _(estimateTimeToArrival(car, booking.departure)))
      .errors(err => console.error('estimate err', err))
      .sortBy((a, b) => a.tta - b.tta)
      // .filter(hit => hit.tta < 15 * 60)
      .errors(err => console.error('fastestCars', err))
  )

const findCars = (booking, cars) =>
  cars
    // _.merge(_(carsCache.values()), _(carPositions).fork())
    .pipe(closestCars(booking))
    .pipe(detourCars(booking))
    .tap(car => {
      console.log('found some cars', car.id, car.detour)
    })
    /*.take(50)
    .tap(car => console.log('closest', car.id, car.tta))
    .pipe(fastestCars(booking))
    .tap(car => console.log('fastest', car.id, car.tta))*/
    .take(5)
    .sortBy((a, b) => a.detour.distance - b.detour.distance)
    .errors(err => console.error('findCars', err))

const detourCars = booking =>
  _.pipeline(cars =>
    cars.flatMap(car =>
      _(
        trip([
          car.position,
          booking.departure,
          booking.destination,
          car.heading
        ]).then(detour => ({
          car,
          detour: detour.code === 'Ok' ? detour.trips.shift() : null
        }))
      )
    )
  )

module.exports = findCars
