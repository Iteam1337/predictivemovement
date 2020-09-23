const pickupInstructions = require('./pickupInstructions')
const vehiclePlan = require('./vehiclePlan')

const register = () => {
  pickupInstructions()
  vehiclePlan()
}

module.exports = {
  register,
}
