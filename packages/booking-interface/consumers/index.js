const { bookingAssignments } = require('./bookingAssignments')
const { pickupConfirmed } = require('./pickupConfirmed')
const { deliveryConfirmed } = require('./deliveryConfirmed')
const { bookingCreated } = require('./bookingCreated')

const register = () => {
  bookingAssignments()
  pickupConfirmed()
  deliveryConfirmed()
  bookingCreated()
}

module.exports = {
  register,
  bookingAssignments,
}
