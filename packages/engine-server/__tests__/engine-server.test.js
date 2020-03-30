const Engine = require('@iteam1337/engine')
const _ = require('highland')
const Car = require('@iteam1337/engine/lib/car')
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

  it('returns a list of cars sorted by distance to target', done => {
    engine.possibleRoutes.fork().toArray(bookings => {
      bookings[0].closestCars.toArray(closestCars => {
        expect(closestCars).toHaveLength(2)
        expect(closestCars[0].detour.diff).toBeLessThan(
          closestCars[1].detour.diff
        )
      })
    })

    engine.offers.fork().toArray(_ => {
      done()
    })
  })
})

describe('cars gets an offer', () => {
  const offerMock = jest
    .fn(offer => Promise.resolve({ approved: false, ...offer }))
    .mockImplementationOnce(offer =>
      Promise.resolve({ approved: true, ...offer })
    )

  beforeEach(() => {
    engine = new Engine({
      bookings: _(mockedBookings),
      cars: _(mockedCars.map(generate)),
    })
  })

  beforeAll(() => {
    jest.spyOn(Car.prototype, 'offer').mockImplementation(offerMock)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('makes an offer to the closest car first', done => {
    engine.possibleRoutes.fork().toArray(_ => {})

    engine.offers.fork().toArray(offers => {
      expect(offerMock).toHaveBeenCalledTimes(2)
      expect(offers).toHaveLength(1)
      done()
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
