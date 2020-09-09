const botServices = require('./services/bot')
const messaging = require('./services/messaging')
const { getBooking, updateBooking, getVehicle } = require('./services/cache')

const {
  open,
  exchanges: { INCOMING_BOOKING_UPDATES },
} = require('./adapters/amqp')

function onPickup(msg) {
  const callbackPayload = JSON.parse(msg.update.callback_query.data)
  updateBooking(callbackPayload.id, { status: callbackPayload.e })
  open
    .then((conn) => conn.createChannel())
    .then((ch) => {
      ch.assertExchange(INCOMING_BOOKING_UPDATES, 'topic', {
        durable: false,
      }).then(() => {
        const { id } = callbackPayload
        ch.publish(
          INCOMING_BOOKING_UPDATES,
          'picked_up',
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
      ch.assertExchange(INCOMING_BOOKING_UPDATES, 'topic', {
        durable: false,
      }).then(() => {
        const { id } = callbackPayload
        ch.publish(
          INCOMING_BOOKING_UPDATES,
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
    const id = ctx.metadata.getId(ctx.botInfo.id)

    const vehicleWithPlan = getVehicle(id)
    if (!vehicleWithPlan || !vehicleWithPlan.activities ) return messaging.onNoInstructionsForVehicle(ctx)
    const activities = vehicleWithPlan.activities
    const bookingIds = vehicleWithPlan.booking_ids

    messaging.onInstructionsForVehicle(
      activities,
      bookingIds,
      ctx.update.message.from.id
    )
  })

  bot.command('/login', (ctx) => {
    ctx.reply(`Skriv in ditt transport id`)
  })

  bot.on('message', (ctx) => {
    const msg = ctx.message

    if (msg.text) botServices.onLogin(msg.text, ctx)

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
      case 'picked_up':
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
