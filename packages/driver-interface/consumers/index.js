const pickupOffers = require('./pickupOffers')
const pickupInstructions = require('./pickupInstructions')
const register = () => {
  pickupOffers()
  pickupInstructions()
}

module.exports = {
  register,
  pickupOffers,
  pickupInstructions,
}
