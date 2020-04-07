const open = require('amqplib').connect('amqp://localhost')
const Stage = require('telegraf/stage')
const { deliveryRequest } = require('./deliveryRequest')

const exchanges = {
  BOOKINGS: 'bookings',
  DELIVERY_REQUESTS: 'delivery_requests',
  CARS: 'cars',
}

const queues = {
  DELIVERY_RPC: 'rpc_queue',
  DELIVERY_REQUESTS: 'delivery_requests',
}

const init = () =>
  open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(queues.DELIVERY_REQUESTS)
        .then(() =>
          ch.assertExchange(exchanges.DELIVERY_REQUESTS, 'fanout', {
            durable: false,
          })
        )
        .then(() =>
          ch.bindQueue(queues.DELIVERY_REQUESTS, exchanges.DELIVERY_REQUESTS)
        )
    )
    .catch(console.warn)

const subscribe = (queue, callback) =>
  open
    .then((conn) =>
      conn.createChannel().then((ch) =>
        ch.consume(queue, (msg) => {
          callback(msg)
          ch.ack(msg)
        })
      )
    )
    .catch(console.warn)

const createBooking = (booking) => {
  return open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertExchange(exchanges.BOOKINGS, 'headers', { durable: false })
        .then((ch) =>
          ch.publish(
            exchanges.BOOKINGS,
            '',
            Buffer.from(JSON.stringify(booking))
          )
        )
    )
    .catch(console.warn)
}

const rpcServer = () => {
  return open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(queues.DELIVERY_RPC, { durable: false })
        .then(() =>
          ch.consume(queues.DELIVERY_RPC, (message) => {
            const msg = JSON.parse(message.content.toString())
            deliveryRequest(msg.id, {
              replyQueue: message.properties.replyTo,
              correlationId: message.properties.correlationId,
            })
            ch.ack(message)
          })
        )
        .catch(console.warn)
    )
}

module.exports = {
  open,
  createBooking,
  init,
  subscribe,
  queues,
  exchanges,
  rpcServer,
}
