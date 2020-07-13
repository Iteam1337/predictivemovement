const { open, queues, exchanges, routingKeys } = require('../adapters/amqp')

const messaging = require('../services/messaging')

const pickupConfirmed = () =>
  open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(queues.PICKUP_CONFIRMED, {
          durable: false,
        })
        .then(() =>
          ch.assertExchange(exchanges.BOOKINGS, 'topic', {
            durable: false,
          })
        )
        .then(() =>
          ch.bindQueue(
            queues.PICKUP_CONFIRMED,
            exchanges.BOOKINGS,
            routingKeys.PICKUP
          )
        )
        .then(
          () =>
              ch.consume(queues.PICKUP_CONFIRMED, (msg) => {
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
