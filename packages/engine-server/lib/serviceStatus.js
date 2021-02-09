const _ = require('highland')
const { connect } = require('amqplib')
const id62 = require('id62').default // https://www.npmjs.com/package/id62
const CHECK_HEALTH = 'check_health'
const CHECK_HEALTH_REPLY = 'check_health_reply'
const open = connect(process.env.AMQP_URL || 'amqp://localhost')

module.exports = {
  /*
  Suggestion:
  - add a function in elixir for readiness (good thing about this is that you can use as a readiness probe from k8s)
  - make rpc call to the readiness elixir function on a timebase and stream the result
  */

  /*
    engine-server starts -> 
      
      sends rpc call to engine to check health
      gets reply OK
      stores OK as latest check health status
      emits to all sockets OK
      ... X seconds passed

      sends rpc call to engine to check health
      gets reply OK
      stores OK as latest check health status
      emits to all sockets OK
      ... X seconds passed

      sends rpc call to engine to check health
      gets reply OK
      stores OK as latest check health status
      emits to all sockets OK
      ... X seconds passed
      ...


    socket connects to engine-server -> 
      checks latest check health status
      emit to socket OK
  */
  serviceStatus: _([{ status: 'massive-disruption' }, { status: 'ok' }]),

  checkServiceStatus: async (cb) => {
    setInterval(async () => {
      try {
        const correlationId = id62()
        const conn = await open
        const channel = await conn.createChannel()
        await channel.assertQueue(CHECK_HEALTH_REPLY, {
          exclusive: true,
        })

        channel.consume(
          CHECK_HEALTH_REPLY,
          (msg) => {
            if (msg.properties.correlationId == correlationId) {
              const isAlive = msg.content.toString() === 'true'
              console.log('we got a result from ELIXIR', isAlive)

              channel.close()
              clearTimeout(timeout)

              cb({ status: isAlive ? 'ok' : 'massive-disruption' })
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
          channel.close()
          cb({ status: 'massive-disruption' })
        }, 10000)
      } catch (ex) {
        console.warn(ex)
        cb({ status: 'massive-disruption' })
      }
    }, 15000)
  },
}
