const {
  open,
  queues: { PICKUP_CONFIRMED },
  exchanges: { BOOKINGS },
} = require('../adapters/amqp')

const messaging = require('../services/messaging')

const pickupConfirmed = () =>
  open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(PICKUP_CONFIRMED, {
          durable: false,
        })
        .then(() =>
          ch.assertExchange(BOOKINGS, 'topic', {
            durable: false,
          })
        )
        .then(() => ch.bindQueue(PICKUP_CONFIRMED, BOOKINGS, 'pickup'))
        .then(
          () =>
            new Promise((resolve) => {
              ch.consume(PICKUP_CONFIRMED, (msg) => {
                const message = JSON.parse(msg.content.toString())
                ch.ack(msg)
                resolve(message)
              })
            })
        )
        .then((msg) => messaging.onPickupConfirmed(msg))
    )

module.exports = { pickupConfirmed }
