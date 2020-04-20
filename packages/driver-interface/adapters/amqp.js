const open = require('amqplib').connect('amqp://localhost')

const exchanges = {
  BOOKINGS: 'bookings',
  // DELIVERY_REQUESTS: 'delivery_requests',
  CARS: 'cars',
}

const queues = {
  PICKUP_OFFERS: 'pickup_offers',
  // DELIVERY_REQUESTS: 'delivery_requests',
  PICKUP_INSTRUCTIONS: 'pickup_instructions',
}

// const subscribe = (queue, callback) =>
//   open
//     .then((conn) =>
//       conn.createChannel().then((ch) =>
//         ch.consume(queue, (msg) => {
//           callback(msg)
//           ch.ack(msg)
//         })
//       )
//     )
//     .catch(console.warn)

// const createBooking = (booking) => {
//   return open
//     .then((conn) => conn.createChannel())
//     .then((ch) =>
//       ch
//         .assertExchange(exchanges.BOOKINGS, 'headers', {
//           durable: false,
//         })
//         .then(() =>
//           ch.publish(
//             exchanges.BOOKINGS,
//             '',
//             Buffer.from(JSON.stringify(booking))
//           )
//         )
//     )
//     .catch(console.warn)
// }

module.exports = {
  open,
  // createBooking,
  queues,
  exchanges,
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
