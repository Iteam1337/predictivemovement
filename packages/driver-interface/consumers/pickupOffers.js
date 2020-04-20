const {
  open,
  queues: { PICKUP_OFFERS },
} = require('../adapters/amqp')

const bot = require('../services/messaging')

const pickupOffers = () => {
  return open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(PICKUP_OFFERS, {
          durable: false,
        })
        .then(() =>
          ch.consume(PICKUP_OFFERS, (message) => {
            const { car, booking } = JSON.parse(message.content.toString())

            bot.messaging.deliveryRequest(
              car.id,
              {
                replyQueue: message.properties.replyTo,
                correlationId: message.properties.correlationId,
              },
              {
                car,
                booking,
              }
            )
            ch.ack(message)
          })
        )
        .catch(console.warn)
    )
}

module.exports = pickupOffers
