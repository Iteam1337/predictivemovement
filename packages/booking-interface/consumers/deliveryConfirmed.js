const { open, queues, exchanges } = require('../adapters/amqp')
const messaging = require('../services/messaging')

const deliveryConfirmed = () =>
  open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(queues.NOTIFY_DELIVERY, {
          durable: false,
        })
        .then(() =>
          ch.assertExchange(exchanges.INCOMING_BOOKING_UPDATES, 'topic', {
            durable: false,
          })
        )
        .then(() =>
          ch.bindQueue(
            queues.NOTIFY_DELIVERY,
            exchanges.INCOMING_BOOKING_UPDATES,
            "delivered"
          )
        )
        .then(
          () =>
            new Promise((resolve) => {
              ch.consume(queues.NOTIFY_DELIVERY, (msg) => {
                const message = JSON.parse(msg.content.toString())
                ch.ack(msg)
                resolve(message)
              })
            })
        )
        .then(
          ({
            metadata: {
              telegram: { senderId },
            },
          }) => {
            return messaging.onDeliveryConfirmed(senderId)
          }
        )
    )

module.exports = { deliveryConfirmed }
