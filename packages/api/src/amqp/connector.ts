const amqp = require('fluent-amqp')(process.env.AMQP_URL || 'amqp://localhost')
amqp.connect()

export {amqp}