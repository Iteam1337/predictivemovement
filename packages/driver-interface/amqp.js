const open = require('amqplib').connect('amqp://localhost')

const exchanges = {
  BOOKINGS: 'bookings',
  DELIVERY_REQUESTS: 'delivery_requests',
  CARS: 'cars',
}

const queues = {
  DELIVERY_REQUESTS: 'delivery_requests',
}

const init = () =>
  open
    .then(conn => conn.createChannel())
    .then(ch =>
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
    .then(conn =>
      conn.createChannel().then(ch =>
        ch.consume(queue, msg => {
          callback(msg)
          ch.ack(msg)
        })
      )
    )
    .catch(console.warn)

const createBooking = booking => {
  console.log(booking)
  return open
    .then(conn => conn.createChannel())
    .then(ch =>
      ch
        .assertExchange(exchanges.BOOKINGS, 'headers', { durable: false })
        .then(ch =>
          ch.publish(
            exchanges.BOOKINGS,
            '',
            Buffer.from(JSON.stringify(booking))
          )
        )
    )
    .catch(console.warn)
}

const deliveryRequest = (driver, isAccepted) => {
  return open
    .then(conn => conn.createChannel())
    .then(ch =>
      ch
        .assertExchange(exchanges.BOOKINGS, 'headers', { durable: false })
        .then(() =>
          ch.publish(
            exchanges.BOOKINGS,
            '',
            Buffer.from(JSON.stringify(driver)),
            {
              headers: { isAccepted },
            }
          )
        )
    )
    .catch(console.warn)
}

const rpcServer = () => {
  return open
    .then(conn => conn.createChannel())
    .then(ch =>
      ch.assertQueue('rpc_queue', { durable: false }).then(() =>
        ch.consume('rpc_queue', msg => {
          const message = msg.toString()

          ch.sendToQueue(msg.properties.replyTo, Buffer.from('someMessage'), {
            correlationId: msg.properties.correlationId,
          })
          ch.ack(msg)
        })
      )
    )
    .catch(console.warn)
}

module.exports = {
  open,
  createBooking,
  init,
  subscribe,
  deliveryRequest,
  queues,
  exchanges,
  rpcServer,
}
