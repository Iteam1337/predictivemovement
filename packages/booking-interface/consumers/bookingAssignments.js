const {
  open,
  queues: { SET_BOOKING_ASSIGNED },
  exchanges: { OUTGOING_BOOKING_UPDATES },
} = require('../adapters/amqp')
const messaging = require('../services/messaging')

const bookingAssignments = () => {
  return open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(SET_BOOKING_ASSIGNED, {
          durable: false,
        })
        .then(() =>
          ch.assertExchange(OUTGOING_BOOKING_UPDATES, 'topic', {
            durable: false,
          })
        )
        .then(() => ch.bindQueue(SET_BOOKING_ASSIGNED, OUTGOING_BOOKING_UPDATES, 'assigned'))
        .then(
          () =>
            new Promise((resolve) => {
              ch.consume(SET_BOOKING_ASSIGNED, (msg) => {
                const message = JSON.parse(msg.content.toString())
                ch.ack(msg)
                resolve(message)
              })
            })
        )
        .then((booking) =>
          messaging.onBookingConfirmed(
            booking.metadata.telegram.senderId,
            booking.assigned_to.id,
            booking.events
          )
        )
    )
}

module.exports = { bookingAssignments }
