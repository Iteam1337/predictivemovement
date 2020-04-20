const {
  open,
  queues: { BOOKING_ASSIGNED },
  exchanges: { BOOKING_ASSIGNMENTS },
} = require('../adapters/amqp')

const bookingAssignments = () => {
  return open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(BOOKING_ASSIGNED, {
          durable: false,
        })
        .then(() =>
          ch.assertExchange(BOOKING_ASSIGNMENTS, 'fanout', {
            durable: false,
          })
        )
        .then(() => ch.bindQueue(BOOKING_ASSIGNED, BOOKING_ASSIGNMENTS))
        .then(
          () =>
            new Promise((resolve) => {
              ch.consume(BOOKING_ASSIGNED, (msg) => {
                const message = JSON.parse(msg.content.toString())
                ch.ack(msg)
                resolve(message)
              })
            })
        )
        .then(() => {
          // Skicka meddelande om booking assigned
        })
    )
}

module.exports = { bookingAssignments }
