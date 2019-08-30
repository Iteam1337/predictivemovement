const redisClient = require('../adapters/redis')
const listen = redisClient()
const redis = redisClient()

module.exports = io => {
  listen.psubscribe('changeRequested:*', () => {})
  listen.psubscribe('routeCreated:*', () => {})
  listen.on('pmessage', async (pattern, channel, msg) => {
    console.log('pmessage', { pattern, channel, msg })
    const id = channel.replace(pattern.replace('*', ''), '')

    let socketIds, message
    try {
      message = await redis.lrange(id, 0, -1)

      socketIds = JSON.parse(message)
    } catch (error) {
      console.error('pmessage', error)
      return
    }

    switch (pattern) {
      case 'routeCreated:*':
        console.log(`congrats to ${socketIds}, routeId: ${msg}`)
        io.to(socketIds).emit('congrats', msg)
        break
      case 'changeRequested:*':
        io.to(socketIds).emit('changeRequested', id)
        break
      case 'tripUpdated':
        io.to(socketIds).emit('tripUpdated', id)
        break
      default:
        console.log('Unhandled redis message ', pattern)
    }
  })
}
