const pickupOffers = require('./pickupOffers')
const pickupInstructions = require('./pickupInstructions')
const vehiclePlan = require('./vehiclePlan')
const register = () => {
  pickupOffers()
  pickupInstructions()
  vehiclePlan()
}

module.exports = {
  register,
  pickupOffers,
  pickupInstructions,
}
