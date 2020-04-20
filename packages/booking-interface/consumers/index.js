const { bookingAssignments } = require('./bookingAssignments')

const register = () => {
  bookingAssignments()
}

module.exports = {
  register,
  bookingAssignments,
}
