const open = require('../adapters/amqp')

const updateLocation = (msg, ctx) => {
  // Publisher
  open
    .then((conn) => conn.createChannel())
    .then((ch) => {
      ch.assertExchange(CARS, 'fanout', {
        durable: false,
      }).then(() => ch.publish(CARS, '', Buffer.from(JSON.stringify(msg))))
    })

    .catch(console.warn)
}

module.exports = { updateLocation }
