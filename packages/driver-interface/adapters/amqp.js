const open = require('amqplib').connect(
  process.env.AMQP_HOST || 'amqp://localhost'
)

const exchanges = {
  INCOMING_BOOKING_UPDATES: 'incoming_booking_updates',
  OUTGOING_BOOKING_UPDATES: 'outgoing_booking_updates',
  INCOMING_VEHICLE_UPDATES: 'incoming_vehicle_updates',
  OUTGOING_VEHICLE_UPDATES: 'outgoing_vehicle_updates',
}

const queues = {
  PICKUP_OFFERS: 'telegram_pickup_offers',
  PICKUP_INSTRUCTIONS: 'pickup_instructions',
  VEHICLE_PLAN: 'vehicle_plan',
}

module.exports = {
  open,
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
