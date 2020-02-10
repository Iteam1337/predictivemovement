const Engine = require('@iteam1337/engine')

const cars = require('./cars')
const bookings = require('./bookings')
const _ = require('highland')

const engine = new Engine({
  bookings: _(bookings),
  cars: _(cars),
})

describe('engine-server', () => {
  it('needs tests', done => {
    engine.possibleRoutes
      .fork()
      .take(5)
      .apply((...bookings) => {
        done()
      })
  })
})
