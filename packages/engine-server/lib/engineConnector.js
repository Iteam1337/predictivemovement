const amqp = require('fluent-amqp')
const queue = amqp('amqp://localhost')

const bookings = queue
  .queue('bookings', { durable: false })
  .subscribe()
  .map(m => m.json())

  const cars = queue.queue('cars', { durable: false }).subscribe().map(m => m.json())

module.exports = {
  bookings,
  cars,
}
