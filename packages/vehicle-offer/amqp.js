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

const exchanges = {}

const queues = {
  OFFER_BOOKING_TO_VEHICLE: 'offer_booking_to_vehicle',
  OFFER_BOOKING_TO_TELEGRAM_VEHICLE: 'offer_bookings_to_telegram_vehicles',
  AUTO_ACCEPT_OFFERS: 'auto_accept_pickup_offers',
}

module.exports = {
  open,
  queues,
  exchanges,
}
