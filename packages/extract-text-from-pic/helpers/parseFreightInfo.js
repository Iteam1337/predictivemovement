const { findPhoneNumbersInText } = require('libphonenumber-js')

function parseFreightInfo(data) {
  return {
    rawData: data,
    adress: '', // ? https://github.com/openvenues/libpostal
    name: '',
    phoneNumber: findPhoneNumbersInText(`${data}`, 'SE'),
  }
}

module.exports = {
  parseFreightInfo,
}
