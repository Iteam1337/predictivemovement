import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  keyPrefix: process.env.REDIS_KEY_NAMESPACE || 'driver-interface:',
})

export default redis
