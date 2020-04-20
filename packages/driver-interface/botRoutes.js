const botServices = require('./services/bot')
const messaging = require('./services/messaging')

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
    if (msg.update.callback_query.data === 'confirm') {
      return messaging.onPickupConfirm(msg)
    }

    try {
      const { a: isAccepted, ...options } = JSON.parse(
        msg.update.callback_query.data
      )

      if (options && options.r && options.id) {
        messaging.onDeliveryRequestResponse(isAccepted, options, msg)
      }
    } catch (error) {
      return
    }
  })
}

module.exports = { init }
