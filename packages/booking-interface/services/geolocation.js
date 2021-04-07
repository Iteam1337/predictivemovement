const axios = require('axios')
const endpoint = process.env.PELIAS_ENDPOINT || 'https://pelias.iteamdev.io'

const get = (q) =>
  axios
    .get(`${endpoint}/v1/search?text=${encodeURIComponent(q)}`)
    .then((res) => res.data.features)

const getReverse = ({ latitude, longitude }) =>
  axios
    .get(`${endpoint}/v1/reverse?point.lat=${latitude}&point.lon=${longitude}`)
    .then((res) => res.data.features)

module.exports = { get, getReverse }
