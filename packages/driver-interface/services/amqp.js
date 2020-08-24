const { open, exchanges } = require('../adapters/amqp')

const updateLocation = (msg, _ctx) => {
  // Publisher
  open
    .then((conn) => conn.createChannel())
    .then((ch) => {
      ch.assertExchange(exchanges.INCOMING_VEHICLE_UPDATES, 'topic', {
        durable: false,
      }).then(() =>
        ch.publish(exchanges.INCOMING_VEHICLE_UPDATES, 'registered', Buffer.from(JSON.stringify(msg)))
      )
    })

    .catch(console.warn)
}

module.exports = { updateLocation }
