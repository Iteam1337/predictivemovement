const pickupOffers = require('./pickupOffers')
// const deliveryRequest = require('./deliveryRequest')
const pickupInstructions = require('./pickupInstructions')
const register = () => {
  pickupOffers()
  // deliveryRequest()
  pickupInstructions()
}

module.exports = {
  register,
  pickupOffers,
  // deliveryRequest,
  pickupInstructions,
}
