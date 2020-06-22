const fetch = require('node-fetch')

const fetchGeoCodes = (postalcode) =>
  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=sweden,${postalcode}&key=${process.env.GOOGLE_API_TOKEN}`
  )
    .then((res) => res.json())
    .then(({ results }) => results[0].geometry.location)
    .then(({ lat, lng: lon }) => ({ coordinates: { lat, lon } }))
    .catch(() => null)

module.exports = {
  fetchGeoCodes,
}
