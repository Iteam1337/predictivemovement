const { open, exchanges } = require('../adapters/amqp')

const createBooking = (booking) => {
  return open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertExchange(exchanges.INCOMING_BOOKING_UPDATES, 'topic', {
          durable: false,
        })
        .then(() =>
          ch.publish(
            exchanges.INCOMING_BOOKING_UPDATES,
            "registered",
            Buffer.from(JSON.stringify({...booking, assigned_to: null}))
          )
        )
    )
    .catch(console.warn)
}

module.exports = { createBooking }
