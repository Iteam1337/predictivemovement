const { open, queues, exchanges } = require('../adapters/amqp')
const messaging = require('../services/messaging')

const deliveryConfirmed = () =>
  open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(queues.NOTIFY_DELIVERY, {
          durable: true,
        })
        .then(() =>
          ch.assertExchange(exchanges.OUTGOING_BOOKING_UPDATES, 'topic', {
            durable: true,
          })
        )
        .then(() =>
          ch.bindQueue(
            queues.NOTIFY_DELIVERY,
            exchanges.OUTGOING_BOOKING_UPDATES,
            'delivered'
          )
        )
        .then(() =>
          ch.consume(queues.NOTIFY_DELIVERY, (msg) => {
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
