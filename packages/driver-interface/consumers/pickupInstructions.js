const {
  open,
  queues: { SEND_PICKUP_INSTRUCTIONS },
  exchanges: { OUTGOING_BOOKING_UPDATES },
} = require('../adapters/amqp')
const { addBooking } = require('../services/cache')

const pickupInstructions = () => {
  return open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(SEND_PICKUP_INSTRUCTIONS, {
          durable: false,
        })
        .then(() =>
          ch.assertExchange(OUTGOING_BOOKING_UPDATES, 'topic', {
            durable: false,
          })
        )
        .then(() =>
          ch.bindQueue(
            SEND_PICKUP_INSTRUCTIONS,
            OUTGOING_BOOKING_UPDATES,
            'assigned'
          )
        )
        .then(() =>
          ch.consume(SEND_PICKUP_INSTRUCTIONS, (msg) => {
            const booking = JSON.parse(msg.content.toString())
            console.log('received booking: ', booking)

            addBooking(booking.id, booking)

            ch.ack(msg)
          })
        )
    )
}

module.exports = pickupInstructions
