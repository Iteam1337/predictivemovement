const {
  open,
  queues: { PICKUP_INSTRUCTIONS },
  exchanges: { BOOKINGS },
} = require('../adapters/amqp')

const { addBooking } = require('../services/cache')

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
            const booking = JSON.parse(msg.content.toString())
            addBooking(booking.id, booking)
            getEstimatedTime(booking)
            sendPickupInstructions(booking)
            ch.ack(msg)
          })
        )
    )
}

const getEstimatedTime = ({ pickup, delivery, assigned_to }) => {
  /**
   * TODO:
   * [] get postion from vehakle
   * [] get pickup and delivery from booking
   * [] count time from vehakle position to delivery postition.
   */
  console.log(
    booking,
    `https://www.google.com/maps/dir/${assigned_to.lat},${assigned_to.lon}/${booking.pickup.lat},${booking.pickup.lon})`
  )
  const carPosition = assigned_to.position
}

module.exports = pickupInstructions
