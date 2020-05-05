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
            new Promise((resolve) => {
              ch.consume(queues.PICKUP_CONFIRMED, (msg) => {
                const message = JSON.parse(msg.content.toString())
                ch.ack(msg)
                resolve(message)
              })
            })
        )
        .then(({ booking: { senderId } }) =>
          messaging.onPickupConfirmed(senderId)
        )
    )

module.exports = { pickupConfirmed }
