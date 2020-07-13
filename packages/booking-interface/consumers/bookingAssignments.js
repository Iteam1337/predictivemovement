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
            ch.consume(BOOKING_ASSIGNED, (msg) => {
              const message = JSON.parse(msg.content.toString())
              console.log('incoming booking assignment')
              ch.ack(msg)
              notifyBooker(message)
            })
        )
    )
}

function notifyBooker (booking) {
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
