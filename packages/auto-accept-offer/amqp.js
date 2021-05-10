const { connect } = require('amqplib')
const amqpTimeout = parseInt(process.env.AMQP_RECONNECT_TIMEOUT, 10) || 5000

function connectRabbit(callback) {
  const connection = connect(process.env.AMQP_URL || 'amqp://localhost')

  connection
    .then((connection) => {
      connection.on('error', (err) => {
        console.error(err)
        setTimeout(() => {
          connectRabbit(callback)
        }, amqpTimeout)
      })

      connection.on('close', (err) => {
        console.error(err)
        setTimeout(() => {
          connectRabbit(callback)
        }, amqpTimeout)
      })

      console.info('=> Connected to RabbitMQ')

      callback(connection)
    })
    .catch((err) => {
      console.error(err)
      setTimeout(() => {
        connectRabbit(callback)
      }, amqpTimeout)
    })
}

const exchanges = {}

const queues = {
  PICKUP_OFFERS: 'auto_accept_pickup_offers',
}

module.exports = {
  connect: connectRabbit,
  queues,
  exchanges,
}
