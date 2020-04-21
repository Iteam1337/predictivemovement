const {
  open,
  queues: { PICKUP_INSTRUCTIONS },
  exchanges: { BOOKING_ASSIGNMENTS },
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
          ch.assertExchange(BOOKING_ASSIGNMENTS, 'fanout', {
            durable: false,
          })
        )
        .then(() => ch.bindQueue(PICKUP_INSTRUCTIONS, BOOKING_ASSIGNMENTS))
        .then(() =>
          ch.consume(PICKUP_INSTRUCTIONS, (msg) => {
            sendPickupInstructions(JSON.parse(msg.content.toString()))
            ch.ack(msg)
          })
        )
    )
}

module.exports = pickupInstructions
