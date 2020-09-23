const botServices = require('./services/bot')
const messaging = require('./services/messaging')
const { getVehicle } = require('./services/cache')

const {
  open,
  exchanges: { INCOMING_BOOKING_UPDATES },
} = require('./adapters/amqp')

function onArrive(msg) {
  const telegramId = msg.update.callback_query.from.id
  const vehicleId = msg.metadata.getVehicleIdFromTelegramId(telegramId)

  return botServices.handleNextDriverInstruction(vehicleId, telegramId)
}

function onPickup(msg) {
  const telegramId = msg.update.callback_query.from.id
  const vehicleId = msg.metadata.getVehicleIdFromTelegramId(telegramId)

  const callbackPayload = JSON.parse(msg.update.callback_query.data)

  return open
    .then((conn) => conn.createChannel())
    .then((ch) => {
      ch.assertExchange(INCOMING_BOOKING_UPDATES, 'topic', {
        durable: false,
      }).then(() => {
        const { id } = callbackPayload

        return ch.publish(
          INCOMING_BOOKING_UPDATES,
          'picked_up',
          Buffer.from(JSON.stringify({ id, status: 'picked_up' }))
        )
      })
    })
    .then(() =>
      botServices.handleDriverArrivedToPickupOrDeliveryPosition(
        vehicleId,
        telegramId
      )
    )
    .catch(console.warn)
}

function onDelivered(msg) {
  const telegramId = msg.update.callback_query.from.id
  const vehicleId = msg.metadata.getVehicleIdFromTelegramId(telegramId)

  const callbackPayload = JSON.parse(msg.update.callback_query.data)

  return open
    .then((conn) => conn.createChannel())
    .then((ch) => {
      ch.assertExchange(INCOMING_BOOKING_UPDATES, 'topic', {
        durable: false,
      }).then(() => {
        const { id } = callbackPayload
        return ch.publish(
          INCOMING_BOOKING_UPDATES,
          'delivered',
          Buffer.from(JSON.stringify({ id, status: 'delivered' }))
        )
      })
    })
    .then(() =>
      botServices.handleDriverArrivedToPickupOrDeliveryPosition(
        vehicleId,
        telegramId
      )
    )
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
    const vehicleId = ctx.metadata.getVehicleIdFromTelegramId(ctx.botInfo.id)
    const vehicleWithPlan = getVehicle(vehicleId)

    if (!vehicleWithPlan || !vehicleWithPlan.activities)
      return messaging.onNoInstructionsForVehicle(ctx)

    const activities = vehicleWithPlan.activities
    const bookingIds = vehicleWithPlan.booking_ids

    return messaging.onInstructionsForVehicle(
      activities,
      bookingIds,
      ctx.update.message.from.id
    )
  })

  bot.command('/login', (ctx) => ctx.reply('Ange ditt transport-id'))

  bot.on('message', (ctx) => {
    const msg = ctx.message

    /** Login attempt from command /login. */
    if (msg.text && msg.text.includes('pmv-')) {
      botServices.onLogin(msg.text, ctx)
    }

    if (!msg.location) return

    return botServices.onLocationMessage(msg, ctx)
  })

  bot.on('edited_message', (ctx) => {
    const msg = ctx.update.edited_message

    /** Telegram live location updates. */
    if (!msg.location) return

    return botServices.onLocationMessage(msg, ctx)
  })

  /** Listen for user invoked button clicks. */
  bot.on('callback_query', (msg) => {
    const callbackPayload = JSON.parse(msg.update.callback_query.data)

    switch (callbackPayload.e) {
      case 'picked_up':
        return onPickup(msg)
      case 'arrived':
        return onArrive(msg)
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
