const open = require('amqplib').connect(
  process.env.AMQP_URL || 'amqp://localhost'
)

const exchanges = {}

const queues = {
  PICKUP_OFFERS: 'auto_accept_pickup_offers'
}

module.exports = {
  open,
  queues,
  exchanges,
}