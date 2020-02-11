const _ = require('highland')

module.exports = {
  assignCars(route) {
    return _(route.closestCars)
      .tap(_ => console.log('assigning cars to', route.booking.id))
      .flatMap(({ car, detour }) =>
        _(car.offer({ booking: route.booking, estimate: detour }))
      )
      .filter(offer => offer.approved)
      .tap(offer => console.log('car approved', offer))
      // .map(trip => trip.car.pickup(trip))
      .errors(err => console.error('assignCars', err))
  },

  // assignCars (booking) {
  //   return _(booking.$fastestCars)
  //     .tap(booking => console.log('assigning cars to', booking.id))
  //     .filter(estimate => !estimate.car.busy)
  //     .sort((a, b) => a.boookingsLastHour - b.boookingsLastHour)
  //     .flatMap(estimate => _(estimate.car.offer({ booking: booking, estimate })))
  //     .filter(offer => offer.approved)
  //     .tap(offer => console.log('car approved', offer))
  //     .map(trip => trip.car.pickup(trip))
  //     .errors(err => console.error('assignCars', err))
  // }
}
