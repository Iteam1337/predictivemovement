const distance = require('./distance')
const { route, trip } = require('./osrm')
const _ = require('highland')

function estimateTimeToArrival(car, destination) {
  return route(car.position, destination)
    .then(route => {
      return {
        distance: route.distance,
        route: route,
        tta: route.duration || 9999,
        car: car,
      }
    })
    .catch(err => console.error('estimated route', err))
}

const closestCars = (booking, within = 5000, count = 50) =>
  _.pipeline(cars =>
    cars
      .map(car => ({
        distance: distance.haversine(car.position, booking.departure),
        car: car,
      }))
      .take(count)
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

const detourCars = booking =>
  _.pipeline(cars =>
    cars.flatMap(car =>
      _(
        trip([
          car.position,
          booking.departure,
          booking.destination,
          car.heading,
        ])
          .then(detour => ({
            car,
            detour: detour.code === 'Ok' ? detour.trips.shift() : null,
          }))
          .then(({ car, detour }) => ({
            car,
            detour: {
              ...detour,
              diff: detour.distance - car.heading.route.distance,
            },
          }))
      )
    )
  )

const findCars = (booking, cars) => {
  const carsCache = new Map()
  cars.fork().each(car => {
    carsCache.set(car.id, car)
  })

  return (
    _.merge([_(carsCache.values()), cars.fork()])
      // _.merge(_(carsCache.values()), _(carPositions).fork())
      .pipe(closestCars(booking))
      .pipe(detourCars(booking))
      /*.take(50)
    .tap(car => console.log('closest', car.id, car.tta))
    .pipe(fastestCars(booking))
    .tap(car => console.log('fastest', car.id, car.tta))*/
      .take(2)
      .sortBy((a, b) => a.detour.diff - b.detour.diff)
      .errors(err => console.error('findCars', err))
  )
}

module.exports = findCars
