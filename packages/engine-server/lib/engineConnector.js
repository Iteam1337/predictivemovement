const amqp = require('fluent-amqp')
const queue = amqp('amqp://localhost')
const { generate } = require('@iteam1337/engine/simulator/cars')

const bookings = queue
  .queue('bookings', { durable: false })
  .subscribe()
  .map(m => m.json())

const cars = queue
  .queue('cars', { durable: false })
  .subscribe()
  .map(m => m.json())
  .map(generate)

const possibleRoutes = queue
  .queue('candidates', { durable: false })
  .subscribe()
  .map(m => m.json())

const updatePosition = car =>
  queue.queue('car_positions', { durable: false }).publish(car)

module.exports = {
  bookings,
  possibleRoutes,
  cars,

  updatePosition,
}
