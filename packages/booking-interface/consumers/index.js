const { bookingAssignments } = require('./bookingAssignments')
const { pickupConfirmed } = require('./pickupConfirmed')
const { deliveryConfirmed } = require('./deliveryConfirmed')

const register = () => {
  bookingAssignments()
  pickupConfirmed()
  deliveryConfirmed()
}

module.exports = {
  register,
  bookingAssignments,
}
