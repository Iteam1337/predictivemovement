const Engine = require('@iteam1337/engine')
const _ = require('highland')
const { generate } = require('@iteam1337/engine/simulator/cars')

const mockedCars = require('./cars').slice(0, 50)
const mockedBookings = require('./bookings')

let engine

describe('engine ', () => {
  beforeEach(() => {
    engine = new Engine({
      bookings: _(mockedBookings),
      cars: _(mockedCars.map(generate)),
    })
  })

  it('gets properly initialized', done => {
    engine.cars.fork().toArray(cars => {
      expect(cars).toHaveLength(50)
      done()
    })
  })
})

describe('cars gets an offer', () => {
  beforeEach(() => {
    engine = new Engine({
      bookings: _(mockedBookings),
      cars: _(mockedCars.map(generate)),
    })
  })

  it('returns a list of cars sorted by distance to target', done => {
    engine.possibleRoutes.fork().toArray(bookings => {
      console.log('bookings: ', bookings.length)
      bookings[0].closestCars.toArray(closestCars => {
        expect(closestCars).toHaveLength(2)
        expect(closestCars[0].detour.diff).toBeLessThan(
          closestCars[1].detour.diff
        )
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
