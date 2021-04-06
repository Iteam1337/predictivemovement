const axios = require('axios')

const get = (q) =>
  axios
    .get(`https://pelias.iteamdev.io/v1/search?text=${encodeURIComponent(q)}`)
    .then((res) => res.data.features)

module.exports = { get }
