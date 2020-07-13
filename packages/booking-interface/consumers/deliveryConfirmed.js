const { open, queues, exchanges, routingKeys } = require('../adapters/amqp')
const messaging = require('../services/messaging')

const deliveryConfirmed = () =>
  open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(queues.DELIVERY_CONFIRMED, {
          durable: false,
        })
        .then(() =>
          ch.assertExchange(exchanges.BOOKINGS, 'topic', {
            durable: false,
          })
        )
        .then(() =>
          ch.bindQueue(
            queues.DELIVERY_CONFIRMED,
            exchanges.BOOKINGS,
            routingKeys.DELIVERED
          )
        )
        .then(
          () =>
              ch.consume(queues.DELIVERY_CONFIRMED, (msg) => {
                const message = JSON.parse(msg.content.toString())
                ch.ack(msg)
                notifyBooker(message)
              })
        )
    )

function notifyBooker(booking) {
  if (booking.metadata.telegram) {
    console.log('Telegram DELIVERY CONFIRMED, notifying booker')
    return messaging.onDeliveryConfirmed(booking.metadata.telegram.senderId)
  }
}

module.exports = { deliveryConfirmed }
