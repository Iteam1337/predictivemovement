const open = require('amqplib').connect('amqp://localhost')

const exchanges = {
  BOOKINGS: 'bookings',
  BOOKING_ASSIGNMENTS: 'booking_assignments',
}

const queues = {
  BOOKING_ASSIGNED: 'booking_assigned',
}

module.exports = {
  open,
  exchanges,
  queues,
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
