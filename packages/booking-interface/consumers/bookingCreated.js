const {
  open,
  queues: { UPDATE_BOOKING },
  exchanges: { OUTGOING_BOOKING_UPDATES },
  routingKeys: { NEW },
} = require('../adapters/amqp')
const messaging = require('../services/messaging')

const bookingCreated = () => {
  return open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(UPDATE_BOOKING, {
          durable: true,
        })
        .then(() =>
          ch.assertExchange(OUTGOING_BOOKING_UPDATES, 'topic', {
            durable: true,
          })
        )
        .then(() => ch.bindQueue(UPDATE_BOOKING, OUTGOING_BOOKING_UPDATES, NEW))
        .then(() =>
          ch.consume(UPDATE_BOOKING, (msg) => {
            const message = JSON.parse(msg.content.toString())
            ch.ack(msg)
            notifyBooker(message)
          })
        )
    )
}

function notifyBooker(bookingObject) {
  const booking = {}
  for (const key in bookingObject) {
    let value = bookingObject[key]
    try {
      value = JSON.parse(bookingObject[key])
    } catch (_) {
    } finally {
      booking[key] = value
    }
  }

  if (booking.metadata.telegram) {
    console.log('Telegram BOOKING CREATED, notifying booker', booking)
    messaging.onBookingCreated(booking.metadata.telegram.senderId, booking)
  }
}

module.exports = { bookingCreated }
