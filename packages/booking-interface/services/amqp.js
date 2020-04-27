const { open, exchanges, routingKeys } = require('../adapters/amqp')

const createBooking = (booking) => {
  return open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertExchange(exchanges.BOOKINGS, 'topic', {
          durable: false,
        })
        .then(() =>
          ch.publish(
            exchanges.BOOKINGS,
            routingKeys.NEW,
            Buffer.from(JSON.stringify(booking))
          )
        )
    )
    .catch(console.warn)
}

module.exports = { createBooking }
