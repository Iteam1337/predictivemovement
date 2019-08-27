const Redis = require('ioredis')
const {
  redis: { host, port },
} = require('../config')

module.exports = () => {
  let client
  try {
    client = new Redis({ port, host })

    client.on('error', error => {
      console.error(error)
      if (!error || !error.code) {
        return
      }
      if (error.code === 'ECONNREFUSED') {
        process.exit(1)
      }
    })
  } catch (error) {
    console.error(error)
    return process.exit(1)
  }

  return client
}
