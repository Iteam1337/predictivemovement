const { connect, queues } = require('./amqp')
console.log('Sending telegram offers to ', queues.TELEGRAM_OFFERS)
console.log('Sending generated offers to ', queues.AUTO_ACCEPT_OFFERS)
console.log(Object.values(queues))

function setupListeners(connection) {
  connection.createChannel().then((ch) => {
    console.log('==> Channel was created')
    return Promise.all(
      Object.values(queues).map((queue) =>
        ch.assertQueue(queue, {
          durable: false,
        })
      )
    )
      .then(() =>
        ch.consume(queues.OFFER_BOOKING_TO_VEHICLE, async (message) => {
          const { vehicle } = JSON.parse(message.content.toString())

          console.log('Received pickup offer to:', vehicle)

          ch.sendToQueue(
            queues.AUTO_ACCEPT_OFFERS,
            message.content,
            message.properties
          )

          ch.ack(message)
        })
      )
      .catch(console.warn)
  })
}

connect(setupListeners)
