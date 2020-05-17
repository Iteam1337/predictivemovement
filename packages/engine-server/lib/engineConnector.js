const amqp = require('fluent-amqp')(process.env.AMQP_HOST || 'amqp://localhost')
// const { generate } = require('@iteam1337/engine/simulator/cars')

const bookings = amqp
  .exchange('bookings', 'topic', {
    durable: false,
  })
  .queue('bookings_to_map', {
    durable: false,
  })
  /* .subscribe is supposed to default to {noAck: true}, dont know what
   * it means but messages are not acked if i don't specify this
   */
  .subscribe({ noAck: true }, 'new')
  .map((bookings) => {
    return bookings.json()
  })

const bookings_delivered = amqp
  .exchange('bookings', 'topic', {
    durable: false,
  })
  .queue('delivered_bookings_to_map', {
    durable: false,
  })
  .subscribe({ noAck: true }, 'delivery')
  .map((bookings) => {
    return bookings.json()
  })

const cars = amqp
  .exchange('cars', 'fanout', {
    durable: false,
  })
  .queue('cars_to_map', {
    durable: false,
  })
  .subscribe({ noAck: true })
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
  bookings_delivered,
  // possibleRoutes,
  cars,
  // updatePosition,
}
