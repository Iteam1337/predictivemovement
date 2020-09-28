const Redis = require('ioredis')
const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  keyPrefix: process.env.REDIS_KEY_NAMESPACE || 'driver-interface:',
})

module.exports = redis
