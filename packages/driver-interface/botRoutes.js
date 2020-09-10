const botServices = require('./services/bot')
const messaging = require('./services/messaging')
const { getVehicle } = require('./services/cache')

const {
  open,
  exchanges: { INCOMING_BOOKING_UPDATES },
} = require('./adapters/amqp')

function onPickup(ctx) {
  const telegramId = ctx.update.callback_query.from.id
  const vehicleId = ctx.metadata.getVehicleIdFromTelegramId(telegramId)
  if (!vehicleId) return messaging.onNoInstructionsForVehicle(ctx)
  const callbackPayload = JSON.parse(ctx.update.callback_query.data)

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
          Buffer.from(JSON.stringify({ id, status: 'picked_up' }))
        )
      })
    })

  return botServices.handlePickupInstruction(vehicleId, telegramId)
}

function onDelivered(ctx) {
  const telegramId = ctx.update.callback_query.from.id
  const vehicleId = ctx.metadata.getVehicleIdFromTelegramId(telegramId)
  if (!vehicleId) return messaging.onNoInstructionsForVehicle(ctx)

  const callbackPayload = JSON.parse(ctx.update.callback_query.data)
  open
    .then((conn) => conn.createChannel())
    .then((ch) => {
      ch.assertExchange(INCOMING_BOOKING_UPDATES, 'topic', {
        durable: false,
      }).then(() => {
        const { id } = callbackPayload
        ch.publish(
          INCOMING_BOOKING_UPDATES,
          'delivered',
          Buffer.from(JSON.stringify({ id, status: 'delivered' }))
        )
      })
    })
    .catch(console.warn)

  return botServices.handlePickupInstruction(vehicleId, telegramId)
}

function onOffer(ctx) {
  const callbackPayload = JSON.parse(ctx.update.callback_query.data)
  const { a: isAccepted, ...options } = callbackPayload
  return messaging.onPickupOfferResponse(isAccepted, options, ctx)
}

const init = (bot) => {
  bot.start(messaging.onBotStart)

  bot.command('/lista', (ctx) => {
    const vehicleId = ctx.metadata.getVehicleIdFromTelegramId(ctx.botInfo.id)

    const vehicleWithPlan = getVehicle(vehicleId)
    if (!vehicleWithPlan || !vehicleWithPlan.activities)
      return messaging.onNoInstructionsForVehicle(ctx)
    const activities = vehicleWithPlan.activities
    const bookingIds = vehicleWithPlan.booking_ids

    messaging.onInstructionsForVehicle(
      activities,
      bookingIds,
      ctx.update.message.from.id
    )
  })

  bot.command('/login', (ctx) => {
    ctx.reply('Ange ditt transport-id')
  })

  bot.on('message', (ctx) => {
    const msg = ctx.message

    /** Login attempt from command /login. */
    if (msg.text && msg.text.includes('pmv-')) {
      botServices.onLogin(msg.text, ctx)
    }

    if (!msg.location) return

    botServices.onLocationMessage(msg, ctx)
  })

  bot.on('edited_message', (ctx) => {
    const msg = ctx.update.edited_message

    /** Telegram live location updates. */
    if (!msg.location) return

    botServices.onLocationMessage(msg, ctx)
  })

  /** Listen for user invoked button clicks. */
  bot.on('callback_query', (ctx) => {
    const callbackPayload = JSON.parse(ctx.update.callback_query.data)

    switch (callbackPayload.e) {
      case 'picked_up':
        return onPickup(ctx)
      case 'delivered':
        return onDelivered(ctx)
      case 'offer':
        return onOffer(ctx)
      default:
        throw new Error(`unhandled event ${callbackPayload.e}`)
    }
  })
}

module.exports = { init }
