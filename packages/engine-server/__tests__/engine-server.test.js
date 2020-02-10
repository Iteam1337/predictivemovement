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

describe('engine-server', () => {
  it('needs tests', done => {
    engine.cars
      .fork()
      .take(5)
      .apply((...bookings) => {
        console.log(bookings)
        done()
      })
  })
})
