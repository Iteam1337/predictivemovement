const fetch = require('node-fetch')
const postnordKey = process.env.POSTNORD_KEY

const search = (id) => {
  return fetch(
    `https://api2.postnord.com/rest/shipment/v1/trackandtrace/findByIdentifier.json?apikey=${postnordKey}&id=${id}&locale=en`
  )
}

module.exports = {
  search,
}
