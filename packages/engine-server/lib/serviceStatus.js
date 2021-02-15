const _ = require('highland')
const { connect } = require('amqplib')
const id62 = require('id62').default // https://www.npmjs.com/package/id62
const CHECK_HEALTH = 'check_health'
const CHECK_HEALTH_REPLY = 'check_health_reply'
const POLLING_TIME = 15000
const WAIT_FOR_ENGINE_TIME = 5000
let LATEST_STATUS = { status: 'ok' }

function getStatus() {
  return new Promise(async (resolve) => {
    let conn
    try {
      conn = await connect(process.env.AMQP_URL || 'amqp://localhost')
      const channel = await conn.createChannel()
      await channel.assertQueue(CHECK_HEALTH_REPLY, {
        exclusive: true,
      })
      const correlationId = id62()

      channel.consume(
        CHECK_HEALTH_REPLY,
        (msg) => {
          if (msg.properties.correlationId == correlationId) {
            const isAlive = msg.content.toString() === 'true'
            clearTimeout(timeout)
            conn.close()
            resolve({ status: isAlive ? 'ok' : 'massive-disruption' })
          }
        },
        { noAck: true }
      )

      const payload = Buffer.from('')
      const options = {
        correlationId,
        replyTo: CHECK_HEALTH_REPLY,
      }

      channel.sendToQueue(CHECK_HEALTH, payload, options)

      timeout = setTimeout(() => {
        conn.close()
        resolve({ status: 'massive-disruption' })
      }, WAIT_FOR_ENGINE_TIME)
    } catch (ex) {
      console.warn(ex)
      if (conn) conn.close()
      resolve({ status: 'massive-disruption' })
    }
  })
}

module.exports = {
  serviceStatus: _(async (push, next) => {
    LATEST_STATUS = await getStatus()
    push(null, LATEST_STATUS)
    setTimeout(next, POLLING_TIME)
  }),

  getStatus: () => LATEST_STATUS,
}
