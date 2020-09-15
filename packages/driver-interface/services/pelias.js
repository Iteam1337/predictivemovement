const fetch = require('node-fetch')

const getAddressFromCoordinate = async ({ lon, lat }) =>
  fetch(
    `https://pelias.iteamdev.io/v1/reverse?point.lat=${lat}&point.lon=${lon}`
  )
    .then((res) => res.json())
    .then(({ features }) => features[0].properties.label)

module.exports = {
  getAddressFromCoordinate,
}
