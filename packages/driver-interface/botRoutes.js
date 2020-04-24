const botServices = require('./services/bot')
const messaging = require('./services/messaging')
const {
  open,
  exchanges: { BOOKINGS },
} = require('./adapters/amqp')

const init = (bot) => {
  bot.start(messaging.onBotStart)

  bot.on('message', (ctx) => {
    const msg = ctx.message
    botServices.onMessage(msg, ctx)
  })

  bot.on('edited_message', (ctx) => {
    const msg = ctx.update.edited_message
    botServices.onMessage(msg, ctx)
  })

  bot.on('callback_query', (msg) => {
    console.log('callback_query')
    if (msg.update.callback_query.data === 'confirm') {
      console.log('confirm')
      return messaging.onPickupConfirm(msg)
    }

    if (msg.update.callback_query.data === 'delivered') {
      console.log('delivered')
      return open
        .then((conn) => conn.createChannel())
        .then((ch) => {
          ch.assertExchange(BOOKINGS, 'topic', {
            durable: false,
          }).then(() =>
            ch.publish(
              BOOKINGS,
              'delivered',
              Buffer.from(JSON.stringify('delivered'))
            )
          )
        })

        .catch(console.warn)
    }

    try {
      const { a: isAccepted, ...options } = JSON.parse(
        msg.update.callback_query.data
      )

      if (options && options.r && options.id) {
        messaging.onPickupOfferResponse(isAccepted, options, msg)
      }
    } catch (error) {
      return
    }
  })
}

module.exports = { init }
