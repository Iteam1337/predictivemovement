const botServices = require('./services/bot')
const messaging = require('./services/messaging')
const {
  getBooking,
  updateBooking,
  getAllBookings,
} = require('./services/cache')

const {
  open,
  exchanges: { BOOKINGS },
} = require('./adapters/amqp')

function onPickup(msg) {
  const callbackPayload = JSON.parse(msg.update.callback_query.data)
  updateBooking(callbackPayload.id, { status: callbackPayload.e })
  open
    .then((conn) => conn.createChannel())
    .then((ch) => {
      ch.assertExchange(BOOKINGS, 'topic', {
        durable: false,
      }).then(() => {
        const { id } = callbackPayload
        ch.publish(
          BOOKINGS,
          'pickup',
          Buffer.from(JSON.stringify(getBooking(id)))
        )
      })
    })

  return messaging.onPickupConfirm(msg)
}

function onDelivered(msg) {
  const callbackPayload = JSON.parse(msg.update.callback_query.data)
  updateBooking(callbackPayload.id, { status: callbackPayload.e })
  return open
    .then((conn) => conn.createChannel())
    .then((ch) => {
      ch.assertExchange(BOOKINGS, 'topic', {
        durable: false,
      }).then(() => {
        const { id } = callbackPayload
        ch.publish(
          BOOKINGS,
          'delivered',
          Buffer.from(JSON.stringify(getBooking(id)))
        )
      })
    })
    .catch(console.warn)
}

function onOffer(msg) {
  const callbackPayload = JSON.parse(msg.update.callback_query.data)
  const { a: isAccepted, ...options } = callbackPayload
  return messaging.onPickupOfferResponse(isAccepted, options, msg)
}

const init = (bot) => {
  bot.start(messaging.onBotStart)

  bot.command('/lista', (ctx) => {
    const id = ctx.update.message.from.id
    console.log(id)
    console.log(getAllBookings())

    ctx.reply('Hej hej här kommer listan.')
  })

  bot.on('message', (ctx) => {
    const msg = ctx.message

    if (!msg.location) return

    ctx.reply('Du finns nu tillgänglig för bokningar')

    botServices.onMessage(msg, ctx)
  })

  bot.on('edited_message', (ctx) => {
    const msg = ctx.update.edited_message
    if (!msg.location) return

    botServices.onMessage(msg, ctx)
  })

  bot.on('callback_query', (msg) => {
    const callbackPayload = JSON.parse(msg.update.callback_query.data)

    switch (callbackPayload.e) {
      case 'pickup':
        return onPickup(msg)

      case 'delivered':
        return onDelivered(msg)

      case 'offer':
        return onOffer(msg)

      default:
        throw new Error(`unhandled event ${callbackPayload.e}`)
    }
  })
}

module.exports = { init }
