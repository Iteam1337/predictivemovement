const {
  open,
  queues: { PICKUP_INSTRUCTIONS },
  exchanges: { BOOKINGS },
} = require('../adapters/amqp')

const { sendPickupInstructions } = require('../services/messaging')

const pickupInstructions = () => {
  return open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(PICKUP_INSTRUCTIONS, {
          durable: false,
        })
        .then(() =>
          ch.assertExchange(BOOKINGS, 'topic', {
            durable: false,
          })
        )
        .then(() => ch.bindQueue(PICKUP_INSTRUCTIONS, BOOKINGS, 'assigned'))
        .then(() =>
          ch.consume(PICKUP_INSTRUCTIONS, (msg) => {
            sendPickupInstructions(JSON.parse(msg.content.toString()))
            ch.ack(msg)
          })
        )
    )
}

module.exports = pickupInstructions
