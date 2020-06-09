const open = require('amqplib').connect(
  process.env.AMQP_HOST || 'amqp://localhost'
)

const exchanges = {}

const queues = {
  CANDIDATES_REQUEST: 'candidates_request',
}

module.exports = {
  open,
  queues,
  exchanges,
}
