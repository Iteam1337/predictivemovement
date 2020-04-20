const { open, queues } = require('../adapters/amqp')
const messaging = require('../services/messaging')

const pickupOffers = () => {
  return open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(queues.PICKUP_OFFERS, {
          durable: false,
        })
        .then(() =>
          ch.consume(queues.PICKUP_OFFERS, (message) => {
            const { car, booking } = JSON.parse(message.content.toString())

            messaging.onDeliveryRequest(
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
