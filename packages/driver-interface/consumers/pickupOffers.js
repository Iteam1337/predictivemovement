const { open, queues } = require('../adapters/amqp')
const messaging = require('../services/messaging')
const google = require('../services/google')

const pickupOffers = () => {
  return open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(queues.OFFER_BOOKING_TO_TELEGRAM_VEHICLE, {
          durable: false,
        })
        .then(() =>
          ch.consume(queues.OFFER_BOOKING_TO_TELEGRAM_VEHICLE, async (message) => {
            const {
              vehicle,
              activities,
              current_route: route,
              booking_ids: bookingIds,
            } = JSON.parse(message.content.toString())
            try {
              const startingAddress = await google.getAddressFromCoordinate(
                activities[1].address
              )

              messaging.sendPickupOffer(
                vehicle.metadata.telegram.senderId,
                {
                  replyQueue: message.properties.replyTo,
                  correlationId: message.properties.correlationId,
                },

                { startingAddress, route, activities, bookingIds }
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
