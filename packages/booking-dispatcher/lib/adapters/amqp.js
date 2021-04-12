const { connect } = require('amqplib')
const amqpTimeout = parseInt(process.env.AMQP_RECONNECT_TIMEOUT, 10) || 5000

function connectRabbit() {
  const connection = connect(process.env.AMQP_URL || 'amqp://localhost')

  connection
    .then((connection) => {
      connection.on('error', (err) => {
        console.error(err)
        setTimeout(() => {
          amqp = connectRabbit()
        }, amqpTimeout)
      })

      connection.on('close', (err) => {
        console.error(err)
        setTimeout(() => {
          amqp = connectRabbit()
        }, amqpTimeout)
      })
    })
    .catch((err) => {
      console.error(err)
      setTimeout(() => {
        amqp = connectRabbit()
      }, amqpTimeout)
    })

  return connection
}

let amqp = connectRabbit()

const exchanges = {
  bookings: {
    name: 'incoming_booking_updates',
    type: 'topic',
    options: { durable: false },
    routingKeys: {
      REGISTERED: 'registered',
    },
  },
}

const queues = {
  ADD_NR_OF_HISTORICAL_BOOKINGS: 'add_nr_of_historical_bookings',
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
