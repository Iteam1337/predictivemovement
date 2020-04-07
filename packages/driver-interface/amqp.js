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
        .then(() =>
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
            deliveryRequest(msg.car.id, {
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

// {
//   car: {
//     route: {
//       weight_name: 'routability',
//       weight: 1561,
//       started: '2020-04-07T13:09:42.334878',
//       legs: [Array],
//       geometry: [Object],
//       duration: 1561,
//       distance: 18171
//     },
//     position: { lon: 11.801236, lat: 57.736512 },
//     instructions: [ [Object], [Object] ],
//     id: 1124095220,
//     heading: { position: [Object], booking: [Object], action: 'pickup' },
//     busy: false
//   },
//   booking: {
//     id: 493,
//     destination: { lon: 16.143512, lat: 61.905908 },
//     departure: { lon: 15.981676, lat: 61.847311 },
//     bookingDate: '2020-04-07T13:09:15.732840Z'
//   }
// }
