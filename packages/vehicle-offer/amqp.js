const open = require('amqplib').connect(
  process.env.AMQP_URL || 'amqp://localhost'
)

const exchanges = {}

const queues = {
  OFFER_BOOKING_TO_VEHICLE: 'offer_booking_to_vehicle',
  OFFER_BOOKING_TO_TELEGRAM_VEHICLE: 'offer_bookings_to_telegram_vehicles',
  AUTO_ACCEPT_OFFERS: 'auto_accept_pickup_offers'
}

module.exports = {
  open,
  queues,
  exchanges,
}