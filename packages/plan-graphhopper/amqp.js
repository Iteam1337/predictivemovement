const open = require('amqplib').connect(
  process.env.AMQP_HOST || 'amqp://localhost'
)

const exchanges = {}

const queues = {
  PLAN_REQUEST: 'plan_request',
}

module.exports = {
  open,
  queues,
  exchanges,
}
