const { open, queues, exchanges } = require('../adapters/amqp')

const messaging = require('../services/messaging')

const pickupConfirmed = () =>
  open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(queues.NOTIFY_PICKUP, {
          durable: false,
        })
        .then(() =>
          ch.assertExchange(exchanges.INCOMING_BOOKING_UPDATES, 'topic', {
            durable: false,
          })
        )
        .then(() =>
          ch.bindQueue(
            queues.NOTIFY_PICKUP,
            exchanges.INCOMING_BOOKING_UPDATES,
            "picked_up"
          )
        )
        .then(
          () =>
              ch.consume(queues.NOTIFY_PICKUP, (msg) => {
                const message = JSON.parse(msg.content.toString())
                ch.ack(msg)
                notifyBooker(message)
              })
        )
    )

function notifyBooker(booking) {
  console.log('PICKUP_CONFIRMED, notifing booker', booking)
  if (booking.metadata.telegram) {
    messaging.onPickupConfirmed(booking.metadata.telegram.senderId)
  }
}

module.exports = { pickupConfirmed }
