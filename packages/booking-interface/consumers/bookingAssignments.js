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
          durable: true,
        })
        .then(() =>
          ch.assertExchange(OUTGOING_BOOKING_UPDATES, 'topic', {
            durable: true,
          })
        )
        .then(() =>
          ch.bindQueue(
            SET_BOOKING_ASSIGNED,
            OUTGOING_BOOKING_UPDATES,
            'assigned'
          )
        )
        .then(() =>
          ch.consume(SET_BOOKING_ASSIGNED, (msg) => {
            const message = JSON.parse(msg.content.toString())
            ch.ack(msg)
            notifyBooker(message)
          })
        )
    )
}

function notifyBooker(booking) {
  if (booking.metadata.telegram) {
    console.log('Telegram BOOKING ASSIGNED, notifying booker', booking)
    messaging.onBookingConfirmed(
      booking.metadata.telegram.senderId,
      booking.assigned_to.id,
      booking.events
    )
  }
}

module.exports = { bookingAssignments }
