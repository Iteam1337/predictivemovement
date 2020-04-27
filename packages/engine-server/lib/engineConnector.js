const amqp = require('fluent-amqp')('amqp://localhost')
// const { generate } = require('@iteam1337/engine/simulator/cars')

const bookings = amqp
  .exchange('bookings', 'topic', { durable: false })
  .queue('booking_requests', { durable: false })
  .subscribe(['*'])
  .map((bookings) => bookings.json())

const cars = amqp
  .exchange('cars', 'fanout', { durable: false })
  .queue('routes', { durable: false })
  .subscribe(['*'])
  .map((cars) => cars.json())
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
