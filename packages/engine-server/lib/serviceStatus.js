const _ = require('highland')
const { connect } = require('amqplib')
const open = connect(process.env.AMQP_URL || 'amqp://localhost')
const id62 = require('id62').default // https://www.npmjs.com/package/id62
const CHECK_HEALTH = 'check_health'
const CHECK_HEALTH_REPLY = 'check_health_reply'

module.exports = {
  /*
    Suggestion:
      - add a function in elixir for readiness (good thing about this is that you can use as a readiness probe from k8s)
      - make rpc call to the readiness elixir function on a timebase and stream the result
  */
  serviceStatus: _([{ status: 'massive-disruption' }, { status: 'ok' }]),
  checkServiceStatus: (cb) => {
    console.log('this happened')

    open
      .then((conn) => conn.createChannel())
      .then((openChannel) =>
        openChannel
          .assertQueue(CHECK_HEALTH_REPLY, {
            exclusive: true,
          })
          .then(() =>
            openChannel.consume(CHECK_HEALTH_REPLY, (status) => {
              console.log('we got a result from ELIXIR', status)
              openChannel.ack()
            })
          )
          .then(() => {
            const correlationId = id62()
            const payload = Buffer.from(JSON.stringify({ hello: 'good song' }))
            const options = {
              correlationId,
              replyTo: CHECK_HEALTH_REPLY,
            }
            return openChannel.sendToQueue(CHECK_HEALTH, payload, options)
          })
      )
      .catch(console.warn)

    cb({ status: 'massive-disruption' })
  },
}
