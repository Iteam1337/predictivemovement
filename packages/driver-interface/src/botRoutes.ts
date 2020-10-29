import * as botServices from './services/bot'
import * as messaging from './services/messaging'
import * as amqp from './services/amqp'
import cache from './services/cache'
import Telegraf from 'telegraf'
import { TelegrafContext } from 'telegraf/typings/context'

async function onArrived(msg) {
  const telegramId = msg.update.callback_query.from.id
  const vehicleId = await cache.getVehicleIdByTelegramId(telegramId)

  return botServices.handleDriverArrivedToPickupOrDeliveryPosition(
    vehicleId,
    telegramId
  )
}

export const init = (bot: Telegraf<TelegrafContext>): void => {
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
    if (msg.contact && msg.contact.phone_number)
      return botServices.onLogin(msg.contact.phone_number, ctx)
    if (msg.location) return botServices.onLocationMessage(msg, ctx)
  })

  bot.on('edited_message', (ctx) => {
    const msg = ctx.update.edited_message

    if (msg.location) return botServices.onLocationMessage(msg, ctx)
  })

  /** Listen for user invoked button clicks. */
  bot.on('callback_query', async (msg) => {
    const callbackPayload = JSON.parse(msg.update.callback_query.data)
    switch (callbackPayload.e) {
      case 'arrived':
        return onArrived(msg)
      case 'picked_up':
      case 'delivered':
      case 'delivery_failed': {
        const telegramId = msg.update.callback_query.from.id
        const { e: event, id: instructionGroupId } = callbackPayload

        return cache
          .getAndDeleteInstructionGroup(instructionGroupId)
          .then(([{ id }]) => id)
          .then((bookingId) => amqp.publishBookingEvent(bookingId, event))
          .then(() => botServices.handleNextDriverInstruction(telegramId))
      }
      default:
        throw new Error(`unhandled event ${callbackPayload.e}`)
    }
  })
}
