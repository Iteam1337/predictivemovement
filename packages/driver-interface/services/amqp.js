const { open, exchanges } = require('../adapters/amqp')

const updateLocation = (msg, _ctx) => {
  // Publisher
  open
    .then((conn) => conn.createChannel())
    .then((ch) => {
      ch.assertExchange(exchanges.CARS, 'fanout', {
        durable: false,
      }).then(() =>
        ch.publish(exchanges.CARS, '', Buffer.from(JSON.stringify(msg)))
      )
    })

    .catch(console.warn)
}

module.exports = { updateLocation }
