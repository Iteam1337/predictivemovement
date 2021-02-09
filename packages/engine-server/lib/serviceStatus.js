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
  serviceStatus: _([{ status: 'massive-disruption' }, { status: 'ok' }]),
  checkServiceStatus: (cb) => {
    const correlationId = id62()
    open
      .then((conn) => conn.createChannel())
      .then((channel) =>
        channel
          .assertQueue(CHECK_HEALTH_REPLY, {
            exclusive: true,
          })
          .then(() =>
            channel.consume(
              CHECK_HEALTH_REPLY,
              (msg) => {
                if (msg.properties.correlationId == correlationId) {
                  console.log(
                    'we got a result from ELIXIR',
                    msg.content.toString(),
                    msg.properties
                  )

                  channel.close()

                  cb({ status: 'massive-disruption' })
                }
              },
              { noAck: true }
            )
          )
      )
      .catch(console.warn)

    open
      .then((conn) => conn.createChannel())
      .then((channel) => {
        const payload = Buffer.from(JSON.stringify({ hello: 'good song' }))
        const options = {
          correlationId,
          replyTo: CHECK_HEALTH_REPLY,
        }
        return channel.sendToQueue(CHECK_HEALTH, payload, options)
      })
      .catch(console.warn)
  },
}
