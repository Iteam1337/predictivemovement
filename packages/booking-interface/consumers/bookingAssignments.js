const {
  open,
  queues: { BOOKING_ASSIGNED },
  exchanges: { BOOKINGS },
} = require('../adapters/amqp')
const messaging = require('../services/messaging')

const bookingAssignments = () => {
  return open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(BOOKING_ASSIGNED, {
          durable: false,
        })
        .then(() =>
          ch.assertExchange(BOOKINGS, 'topic', {
            durable: false,
          })
        )
        .then(() => ch.bindQueue(BOOKING_ASSIGNED, BOOKINGS, 'assigned'))
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
