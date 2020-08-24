const { open, queues } = require('./amqp')
console.log('Sending telegram offers to ', queues.TELEGRAM_OFFERS)
console.log('Sending generated offers to ', queues.AUTO_ACCEPT_OFFERS)
console.log(Object.values(queues))
open
  .then((conn) => conn.createChannel())
  .then((ch) =>
    Promise.all(
      Object.values(queues).map((queue) =>
        ch.assertQueue(queue, {
          durable: false,
        })
      )
    )
      .then(() =>
        ch.consume(queues.OFFER_BOOKING_TO_VEHICLE, async (message) => {
          const { vehicle } = JSON.parse(message.content.toString())
          const fromTelegram = vehicle.metadata && vehicle.metadata.telegram
          const queue = fromTelegram
            ? queues.OFFER_BOOKING_TO_TELEGRAM_VEHICLE
            : queues.AUTO_ACCEPT_OFFERS
          console.log("Received pickup offer to:", vehicle)
          console.log("To queue:", queue)

          ch.sendToQueue(queue, message.content, message.properties)

          ch.ack(message)
        })
      )
      .catch(console.warn)
  )
