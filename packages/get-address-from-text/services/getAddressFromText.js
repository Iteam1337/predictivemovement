const addressParser = require('../helpers/address-parser')

function getAddressFromText(text) {
  return {
    rawData: text,
    adress: addressParser.expandAndParse(text),
  }
}

module.exports = {
  getAddressFromText,
}
