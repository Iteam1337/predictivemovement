const amqp = require('fluent-amqp')(process.env.AMQP_HOST || 'amqp://localhost')
// const { generate } = require('@iteam1337/engine/simulator/cars')

const routingKeys = {
  NEW: 'new',
}

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
  .subscribe({ noAck: true }, routingKeys.NEW)
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

const bookings_assigned = amqp
  .exchange('bookings', 'topic', {
    durable: false,
  })
  .queue('assigned_bookings_to_map', {
    durable: false,
  })
  .subscribe({ noAck: true }, 'assigned')
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

const createBooking = (booking) => {
  return amqp
    .exchange('bookings', 'topic', {
      durable: false,
    })
    .publish(booking, routingKeys.NEW)
    .then(() =>
      console.log(` [x] Created booking '${JSON.stringify(booking, null, 2)}'`)
    )
}

module.exports = {
  bookings,
  bookings_delivered,
  bookings_assigned,
  // possibleRoutes,
  cars,
  createBooking,
  // updatePosition,
}
