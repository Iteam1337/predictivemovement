const { connect, queues } = require('./amqp')

function setupListeners(connection) {
  connection.createChannel().then((ch) =>
    ch
      .assertQueue(queues.PICKUP_OFFERS, {
        durable: false,
      })
      .then(() =>
        ch.consume(queues.PICKUP_OFFERS, async (message) => {
          const { replyTo, correlationId } = message.properties

          console.log('accepting the offer now')

          try {
            ch.sendToQueue(replyTo, Buffer.from(JSON.stringify(true)), {
              correlationId,
            })

            ch.ack(message)
          } catch (error) {
            console.warn('something borked: ', error)
          }
        })
      )
      .catch(console.warn)
  )
}

connect(setupListeners)
