const { connect } = require('amqplib')
const amqpTimeout = parseInt(process.env.AMQP_RECONNECT_TIMEOUT, 10) || 5000

function connectRabbit() {
  const connection = connect(process.env.AMQP_URL || 'amqp://localhost')

  connection
    .then((connection) => {
      connection.on('error', (err) => {
        console.error(err)
        setTimeout(() => {
          open = connectRabbit()
        }, amqpTimeout)
      })

      connection.on('close', (err) => {
        console.error(err)
        setTimeout(() => {
          open = connectRabbit()
        }, amqpTimeout)
      })
    })
    .catch((err) => {
      console.error(err)
      setTimeout(() => {
        open = connectRabbit()
      }, amqpTimeout)
    })

  return connection
}

let open = connectRabbit()

const exchanges = {
  INCOMING_BOOKING_UPDATES: 'incoming_booking_updates',
  OUTGOING_BOOKING_UPDATES: 'outgoing_booking_updates',
  FREIGHTSLIPS: 'freightslips',
}

const queues = {
  SET_BOOKING_ASSIGNED: 'set_booking_assigned_in_booker_interface',
  NOTIFY_PICKUP: 'notify_booker_of_pickup',
  NOTIFY_DELIVERY: 'notify_booker_of_delivery',
  UPDATE_BOOKING: 'update_booking_in_booker_interface',
}

const routingKeys = {
  DELIVERED: 'delivered',
  PICKED_UP: 'picked_up',
  NEW: 'new',
}

module.exports = {
  open,
  exchanges,
  queues,
  routingKeys,
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
//     departure: { lon: 15.981676, lat: 61.847311 }
//   }
// }
