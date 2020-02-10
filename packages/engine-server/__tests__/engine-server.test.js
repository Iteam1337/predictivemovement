const Engine = require('@iteam1337/engine')
const _ = require('highland')
const { generate } = require('@iteam1337/engine/simulator/cars')

const mockedCars = require('./cars').slice(0, 10)
const mockedBookings = require('./bookings')

const engine = new Engine({
  bookings: _(mockedBookings),
  cars: _(mockedCars.map(generate))
    .map(car => _('moved', car))
    .errors(err => console.error('move error', err))
    .merge(),
})

describe('cars gets an offer', () => {
  it('will make an offer to the closest car', done => {
    engine.possibleRoutes.fork().apply(cars => {
      console.log('cars', cars)
      cars.closestCars
        .fork()
        .batchWithTimeOrCount(1000, 1)
        .apply(closestCars => {
          console.log('closestCars', closestCars)
          done()
        })
    })
  })

  // describe('first offered car declines', () => {
  //   it('offers to the second closest car', () => {
  //     const offeredCar = engine.possibleRoutes.booking.car[1]
  //     timer.tick(5000)
  //     expect(offeredCar.offer).toHaveBeenCalled()
  //   })
  // })
})
