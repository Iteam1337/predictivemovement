const { open, queues } = require('./amqp')
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
        ch.consume(queues.PICKUP_OFFERS, async (message) => {
          const { vehicle } = JSON.parse(message.content.toString())

          const fromTelegram = vehicle.metadata && vehicle.metadata.telegram
          const queue = fromTelegram
            ? queues.TELEGRAM_OFFERS
            : queues.AUTO_ACCEPT_OFFERS

          ch.sendToQueue(queue, message.content, message.properties)

          ch.ack(message)
        })
      )
      .catch(console.warn)
  )
