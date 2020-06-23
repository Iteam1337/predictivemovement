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
            const {
              vehicle,
              plan,
              route,
              booking_ids: bookingIds,
            } = JSON.parse(message.content.toString())
            try {
              const startingAddress = await google.getAddressFromCoordinate(
                plan[1].address
              )

              messaging.sendPickupOffer(
                vehicle.metadata.telegram.senderId,
                {
                  replyQueue: message.properties.replyTo,
                  correlationId: message.properties.correlationId,
                },

                { startingAddress, route, plan, bookingIds }
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
