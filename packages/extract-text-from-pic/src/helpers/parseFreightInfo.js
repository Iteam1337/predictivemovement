const { findPhoneNumbersInText } = require('libphonenumber-js')
const addressParser = require('./address-parser')

function parseFreightInfo(data) {
  return {
    rawData: data,
    adress: addressParser.expandAndParse(data),
    name: '',
    phoneNumber: findPhoneNumbersInText(data, 'SE').map(
      ({ number: x }) => x.number
    ),
  }
}

module.exports = {
  parseFreightInfo,
}
