import * as botServices from './services/bot'
import * as messaging from './services/messaging'
import * as amqp from './services/amqp'
import cache from './services/cache'
import Telegraf from 'telegraf'
import { TelegrafContext } from 'telegraf/typings/context'
import { Instruction } from './types'

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
    const telegramId = ctx.update.message.from.id
    const vehicleId = await cache.getVehicleIdByTelegramId(telegramId)

    if (!vehicleId) return messaging.promptForLogin(ctx)

    const instructionGroups = await cache.getInstructions(vehicleId)

    if (!instructionGroups) return messaging.onNoInstructionsForVehicle(ctx)

    return messaging.sendSummary(telegramId, instructionGroups)
  })

  bot.command('/login', messaging.requestPhoneNumber)

  bot.on('message', (ctx) => {
    const msg = ctx.message
    if (msg.contact && msg.contact.phone_number)
      return botServices.onLogin(msg.contact.phone_number, ctx)
    if (msg.location) return botServices.onLocationMessage(msg)
    if (msg.photo) return botServices.onPhotoReceived(msg.from.id, msg.photo)
  })

  bot.on('edited_message', (ctx) => {
    const msg = ctx.update.edited_message

    if (msg.location) return botServices.onLocationMessage(msg)
  })

  /** Listen for user invoked button clicks. */
  bot.on('callback_query', async (msg: TelegrafContext) => {
    const callbackPayload = JSON.parse(msg.update.callback_query.data)
    const telegramId = msg.update.callback_query.from.id
    const { e: event, id: instructionGroupId, bookingIds } = callbackPayload

    switch (event) {
      case 'arrived':
        return onArrived(msg)
      case 'begin_delivery_acknowledgement':
        return botServices.beginDeliveryAcknowledgement(
          telegramId,
          instructionGroupId
        )
      case 'delivered':
        return cache
          .setDriverDoneDelivering(telegramId)
          .then(() =>
            Promise.all(
              bookingIds.map((bookingId: string) =>
                amqp.publishBookingEvent(bookingId, 'delivered')
              )
            )
          )
          .then(() => botServices.handleNextDriverInstruction(telegramId))

      case 'picked_up':
      case 'delivery_failed': {
        return cache
          .getAndDeleteInstructionGroup(instructionGroupId)
          .then((instructionGroup: Instruction[]) =>
            Promise.all(
              instructionGroup.map(({ id: bookingId }: Instruction) =>
                amqp.publishBookingEvent(bookingId, event)
              )
            )
          )
          .then(() => botServices.handleNextDriverInstruction(telegramId))
      }
      default:
        throw new Error(`unhandled event ${callbackPayload.e}`)
    }
  })
}
