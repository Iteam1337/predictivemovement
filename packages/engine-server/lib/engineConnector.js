const amqp = require('fluent-amqp')('amqp://localhost')
// const { generate } = require('@iteam1337/engine/simulator/cars')

const bookings = amqp
  .exchange('bookings', 'topic', {
    durable: false,
  })
  .queue('bookings_to_map', {
    durable: false,
  })
  .subscribe(
    {
      noAck: false,
    },
    ['new']
  )
  .each((bookings) => bookings.ack())
  .map((bookings) => {
    console.log(bookings)
    return bookings.json()
  })

const cars = amqp
  .exchange('cars', 'fanout', {
    durable: false,
  })
  .queue('map_car_positions', {
    durable: false,
  })
  .subscribe(['*'])
  .map((cars) => {
    return cars.json()
  })
// .map(generate)

// const possibleRoutes = amqp
//   .queue('candidates', { durable: false })
//   .subscribe()
//   .map((possibleRoutes) => possibleRoutes.json())

// const updatePosition = car =>
//   queue.queue('car_positions', { durable: false }).publish(car)

module.exports = {
  bookings,
  // possibleRoutes,
  cars,
  // updatePosition,
}
