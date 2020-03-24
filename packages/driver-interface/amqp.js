const open = require('amqplib').connect('amqp://localhost')

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

module.exports = { open, createBooking }
