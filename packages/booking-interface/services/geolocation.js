const axios = require('axios')

const get = (q) => {
  const query = encodeURIComponent(q)
  console.log('this is query', query)
  return axios
    .get(`https://pelias.iteamdev.io/v1/search?text=${query}`)
    .then((res) => res.data.features)
}

const getStructured = (params) => {
  return axios
    .get(`https://pelias.iteamdev.io/v1/structured${params}`)
    .then((res) => res.data.features)
}

module.exports = { get, getStructured }
