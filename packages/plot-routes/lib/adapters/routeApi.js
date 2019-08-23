const { create } = require('axios')
const { routeApi } = require('../config')

const axios = create({ baseURL: routeApi })

module.exports = axios
