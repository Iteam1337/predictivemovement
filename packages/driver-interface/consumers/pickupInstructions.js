const {
  open,
  queues: { ADD_BOOKING_INFO },
  exchanges: { OUTGOING_BOOKING_UPDATES },
} = require('../adapters/amqp')
const { addBooking } = require('../services/cache')

const pickupInstructions = () => {
  return open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(ADD_BOOKING_INFO, {
          durable: false,
        })
        .then(() =>
          ch.assertExchange(OUTGOING_BOOKING_UPDATES, 'topic', {
            durable: false,
          })
        )
        .then(() =>
          ch.bindQueue(
            ADD_BOOKING_INFO,
            OUTGOING_BOOKING_UPDATES,
            'assigned'
          )
        )
        .then(() =>
          ch.consume(ADD_BOOKING_INFO, (msg) => {
            const booking = JSON.parse(msg.content.toString())
            console.log('received booking: ', booking)

            addBooking(booking.id, booking)

            ch.ack(msg)
          })
        )
    )
}

module.exports = pickupInstructions
