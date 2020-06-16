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

          try {
            const routes = await findRoutes(vehicles, bookings)
            ch.sendToQueue(replyTo, Buffer.from(JSON.stringify(routes)), {
              correlationId,
            })
          } catch (error) {
            console.warn('something borked: ', error)
          }
          ch.ack(message)
        })
      )
      .catch(console.warn)
  )
