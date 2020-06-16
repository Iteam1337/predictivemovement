const { open, queues } = require('../adapters/amqp')
const messaging = require('../services/messaging')
const google = require('../services/google')
const { addBooking } = require('../services/cache')

const pickupOffers = () => {
  return open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(queues.PICKUP_OFFERS, {
          durable: false,
        })
        .then(() =>
          ch.consume(queues.PICKUP_OFFERS, async (message) => {
            const { vehicle, booking } = JSON.parse(message.content.toString())
            try {
              const pickupAddress = await google.getAddressFromCoordinate(
                booking.pickup
              )

              const deliveryAddress = await google.getAddressFromCoordinate(
                booking.delivery
              )

              addBooking(booking.id, {
                vehicle,
                booking: {
                  ...booking,
                  assigned_to: vehicle,
                  pickupAddress,
                  deliveryAddress,
                },
              })
              console.log({ booking })

              messaging.sendPickupOffer(
                vehicle.id,
                {
                  replyQueue: message.properties.replyTo,
                  correlationId: message.properties.correlationId,
                },
                { pickupAddress, deliveryAddress, booking }
              )
              ch.ack(message)
            } catch (error) {
              console.warn(
                'something went wrong with getting address from google: ',
                error
              )
            }
          })
        )
        .catch(console.warn)
    )
}

module.exports = pickupOffers
