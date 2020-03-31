const open = require('amqplib').connect('amqp://localhost')

const exchanges = {
  BOOKINGS: 'bookings',
  BOOKING_SUGGESTIONS: 'booking_suggestions',
}

const queues = {
  BOOKING_SUGGESTIONS: 'booking_suggestions',
}

const init = () =>
  open
    .then(conn => conn.createChannel())
    .then(ch =>
      ch
        .assertQueue(queues.BOOKING_SUGGESTIONS)
        .then(() =>
          ch.assertExchange(exchanges.BOOKING_SUGGESTIONS, 'fanout', {
            durable: false,
          })
        )
        .then(() =>
          ch.bindQueue(
            queues.BOOKING_SUGGESTIONS,
            exchanges.BOOKING_SUGGESTIONS
          )
        )
    )
    .catch(console.warn)

const subscribe = (queue, callback) =>
  open
    .then(conn =>
      conn.createChannel().then(ch =>
        ch.consume(queue, msg => {
          callback(msg)
          ch.ack(msg)
        })
      )
    )
    .catch(console.warn)

const createBooking = booking => {
  const exchange = 'bookings'
  return open
    .then(conn => conn.createChannel())
    .then(ch =>
      ch
        .assertExchange(exchange, 'headers', { durable: false })
        .then(() =>
          ch.publish(exchange, '', Buffer.from(JSON.stringify(booking)))
        )
    )
    .catch(console.warn)
}

module.exports = { open, createBooking, init, subscribe, queues, exchanges }
