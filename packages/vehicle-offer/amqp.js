const open = require('amqplib').connect(
  process.env.AMQP_HOST || 'amqp://localhost'
)

const exchanges = {}

const queues = {
  PICKUP_OFFERS: 'pickup_offers',
  TELEGRAM_OFFERS: 'telegram_pickup_offers',
  AUTO_ACCEPT_OFFERS: 'auto_accept_pickup_offers'
}

module.exports = {
  open,
  queues,
  exchanges,
}