const botServices = require('./services/bot')
const messaging = require('./services/messaging')
const cache = require('./services/cache')
const {
  open,
  exchanges: { INCOMING_BOOKING_UPDATES },
} = require('./adapters/amqp')

const channel = open
  .then((conn) => conn.createChannel())
  .then((ch) => {
    ch.assertExchange(INCOMING_BOOKING_UPDATES, 'topic', {
      durable: false,
    })
    return ch
  })

async function onArrived(msg) {
  const telegramId = msg.update.callback_query.from.id
  const vehicleId = await cache.getVehicleIdByTelegramId(telegramId)

  return botServices.handleDriverArrivedToPickupOrDeliveryPosition(
    vehicleId,
    telegramId
  )
}

function handleBookingEvent(telegramId, bookingIds, event) {
  return channel
    .then((openChannel) =>
      Promise.all(
        bookingIds.map((id) =>
          openChannel.publish(
            INCOMING_BOOKING_UPDATES,
            event,
            Buffer.from(JSON.stringify({ id, status: event }))
          )
        )
      )
    )
    .catch(console.warn)
    .then(() => botServices.handleNextDriverInstruction(telegramId))
}

function onOffer(msg) {
  const callbackPayload = JSON.parse(msg.update.callback_query.data)
  const { a: isAccepted, ...options } = callbackPayload
  return messaging.onPickupOfferResponse(isAccepted, options, msg)
}

const init = (bot) => {
  bot.start(messaging.onBotStart)

  bot.command('/lista', async (ctx) => {
    const vehicleId = await cache.getVehicleIdByTelegramId(ctx.botInfo.id)
    const vehicleWithPlan = await cache.getVehicle(vehicleId)

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

  bot.command('/login', messaging.onPromptUserForTransportId)

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
  bot.on('callback_query', async (msg) => {
    const callbackPayload = JSON.parse(msg.update.callback_query.data)
    switch (callbackPayload.e) {
      case 'offer':
        return onOffer(msg)
      case 'arrived':
        return onArrived(msg)
      case 'picked_up':
      case 'delivered':
      case 'delivery_failed': {
        const { id: telegramId } = msg.update.callback_query.from

        const { e: event, id: instructionGroupId } = callbackPayload

        const instructionGroup = await cache.getAndDeleteInstructionGroup(
          instructionGroupId
        )

        return handleBookingEvent(
          telegramId,
          instructionGroup.map((ig) => ig.id),
          event
        )
      }
      default:
        throw new Error(`unhandled event ${callbackPayload.e}`)
    }
  })
}

module.exports = { init }
