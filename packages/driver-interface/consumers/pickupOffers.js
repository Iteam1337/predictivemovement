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
            const { car, booking } = JSON.parse(message.content.toString())
            try {
              const pickupAddress = await google.getAddressFromCoordinate(
                booking.departure
              )

              const deliveryAddress = await google.getAddressFromCoordinate(
                booking.destination
              )

              addBooking(booking.id, {
                booking: {
                  ...booking,
                  assigned_to: car,
                  pickupAddress,
                  deliveryAddress,
                },
              })

              messaging.sendPickupOffer(
                car.id,
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
                error.message
              )
            }
          })
        )
        .catch(console.warn)
    )
}

module.exports = pickupOffers
