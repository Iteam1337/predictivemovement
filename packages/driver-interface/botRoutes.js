const botServices = require('./services/bot')
const messaging = require('./services/messaging')
const {
  open,
  exchanges: { BOOKINGS },
} = require('./adapters/amqp')

const init = (bot) => {
  bot.start(messaging.onBotStart)

  bot.on('message', (ctx) => {
    console.log('on message ctx', ctx)
    console.log('on message message', ctx.message)
    const msg = ctx.message
    botServices.onMessage(msg, ctx)
  })

  bot.on('edited_message', (ctx) => {
    const msg = ctx.update.edited_message
    botServices.onMessage(msg, ctx)
  })

  bot.on('callback_query', (msg) => {
    if (msg.update.callback_query.data.event === 'pickup') {
      open
        .then((conn) => conn.createChannel())
        .then((ch) => {
          console.log('this is the msg: ', msg)
          ch.assertExchange(BOOKINGS, 'topic', {
            durable: false,
          }).then(() => {
            const data = ({ senderId, carId } = msg.update.callback_query.data)
            ch.publish(BOOKINGS, 'pickup', Buffer.from(JSON.stringify(data)))
          })
        })

      return messaging.onPickupConfirm(msg)
    }

    if (msg.update.callback_query.data.event === 'delivered') {
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
