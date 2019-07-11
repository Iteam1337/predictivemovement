const Redis = require('ioredis')
const {
  redis: { host, port },
} = require('../config')

const redis = new Redis({
  port,
  host,
})
const pub = new Redis({
  port,
  host,
})

module.exports = {
  redis,
  pub,
}
