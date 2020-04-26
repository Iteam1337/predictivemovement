const amqp = require('fluent-amqp')('amqp://localhost')
// const { generate } = require('@iteam1337/engine/simulator/cars')

const bookings = amqp
  .exchange('bookings', 'topic', { durable: true })
  .queue()
  .subscribe()
  .map((bookings) => bookings.json())

const cars = amqp
  .exchange('cars', 'fanout', { durable: false })
  .queue('client_location', { durable: true })
  .subscribe()
  .map((cars) => cars.json())
// .map(generate)

const possibleRoutes = amqp
  .queue('candidates', { durable: false })
  .subscribe()
  .map((possibleRoutes) => possibleRoutes.json())

// const updatePosition = car =>
//   queue.queue('car_positions', { durable: false }).publish(car)

module.exports = {
  bookings,
  possibleRoutes,
  cars,
  // updatePosition,
}
