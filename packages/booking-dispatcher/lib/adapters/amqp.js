const amqp = require('amqplib').connect(
  process.env.AMQP_HOST || 'amqp://localhost'
)

const exchanges = {
  bookings: {
    name: 'bookings',
    type: 'topic',
    options: { durable: false },
    routingKeys: {
      NEW: 'new',
    },
  },
}

const queues = {
  HISTORICAL_BOOKINGS: 'historical_bookings',
}

const publish = (exchange, routingKey, data) => {
  return amqp
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertExchange(exchange.name, exchange.type, exchange.options)
        .then(() =>
          ch.publish(
            exchange.name,
            routingKey,
            Buffer.from(JSON.stringify(data))
          )
        )
    )
    .catch(console.warn)
}

module.exports = { exchanges, publish, amqp, queues }
