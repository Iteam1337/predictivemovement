const { open, queues } = require('./amqp')
const { findRoutes } = require('./graphhopper')

open
  .then((conn) => conn.createChannel())
  .then((ch) =>
    ch
      .assertQueue(queues.CANDIDATES_REQUEST, {
        durable: false,
      })
      .then(() =>
        ch.consume(queues.CANDIDATES_REQUEST, async (message) => {
          const { vehicles, bookings } = JSON.parse(message.content.toString())
          const { replyTo, correlationId } = message.properties
          const routes = await findRoutes(vehicles, bookings)

          try {
            ch.sendToQueue(replyTo, Buffer.from(JSON.stringify(routes)), {
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
