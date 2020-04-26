const {
  open,
  exchanges: { BOOKINGS },
} = require('../adapters/amqp')

const createBooking = (booking) => {
  return open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertExchange(BOOKINGS, 'topic', {
          durable: false,
        })
        .then(() =>
          ch.publish(BOOKINGS, 'new', Buffer.from(JSON.stringify(booking)))
        )
    )
    .catch(console.warn)
}

module.exports = { createBooking }
