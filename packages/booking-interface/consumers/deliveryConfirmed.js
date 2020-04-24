const { open, queues, exchanges } = require('../adapters/amqp')

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
            'delivery'
          )
        )
        .then(
          () =>
            new Promise((resolve) => {
              ch.consume(queues.DELIVERY_CONFIRMED, (msg) => {
                const message = JSON.parse(msg.content.toString())
                ch.ack(msg)
                resolve(message)
              })
            })
        )
        .then((msg) => messaging.onDeliveryConfirmed(msg))
    )

module.exports = { deliveryConfirmed }
