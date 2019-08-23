const { create } = require('axios')
const { osrm } = require('../config')

const axios = create({ baseURL: osrm })

module.exports = axios
