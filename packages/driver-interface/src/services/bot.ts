import * as amqp from './amqp'
import cache from './cache'
import { v4 as uuid } from 'uuid'

import * as messaging from './messaging'
import { IncomingMessage, Message } from 'telegraf/typings/telegram-types'
import { TelegrafContext } from 'telegraf/typings/context'

export const driverIsLoggedIn = async (vehicleId) => {
  const vehicle = await cache.getVehicle(vehicleId)
  return !!vehicle.telegramId
}

export const onLogin = async (
  phoneNumber: string,
  ctx: TelegrafContext
): Promise<Message | void> => {
  const vehicleId = await cache.getVehicleIdByPhoneNumber(phoneNumber)
  const vehicle = await cache.getVehicle(vehicleId)

  if (!vehicle) return messaging.onNoVehicleFoundFromId(ctx)
  const telegramId = ctx.update.message.from.id
  await cache.setVehicleIdByTelegramId(telegramId, vehicleId)
  await cache.addVehicle(vehicleId, {
    ...vehicle,
    telegramId,
  })
  return messaging
    .onDriverLoginSuccessful(ctx)
    .then(() => handleNextDriverInstruction(telegramId))
}

export const onLocationMessage = async (
  msg: IncomingMessage,
  ctx: TelegrafContext
): Promise<void> => {
  const vehicleId = await cache.getVehicleIdByTelegramId(msg.from.id)

  const message = {
    location: {
      lon: msg.location.longitude,
      lat: msg.location.latitude,
    },
    id: vehicleId,
  }

  amqp.updateLocation(message, ctx)
}

export const handleNextDriverInstruction = async (
  telegramId: number
): Promise<Message> => {
  try {
    const vehicleId = await cache.getVehicleIdByTelegramId(telegramId)
    console.log("getting instructions for ", vehicleId)
    
    if (!await cache.getInstructions(vehicleId)) {
      console.log("No instructions found")
      return
    }
    const [currentInstructionGroup] = await cache.getInstructions(vehicleId)

    if (!currentInstructionGroup)
      return messaging.sendDriverFinishedMessage(telegramId)

    const bookings = await cache.getBookings(
      currentInstructionGroup.map((g) => g.id)
    )

    const type = currentInstructionGroup[0].type

    if (type === 'pickupShipment')
      return messaging.sendPickupInstruction(
        currentInstructionGroup,
        telegramId,
        bookings
      )

    if (type === 'deliverShipment')
      return messaging.sendDeliveryInstruction(
        currentInstructionGroup,
        telegramId,
        bookings
      )
  } catch (error) {
    console.log('error in handleNextDriverInstruction: ', error)
    return
  }
}

export const handleDriverArrivedToPickupOrDeliveryPosition = async (
  vehicleId: string,
  telegramId: number
): Promise<Message | string> => {
  try {
    const [nextInstructionGroup, ...rest] = await cache.getInstructions(
      vehicleId
    )

    const instructionGroupId = uuid().slice(0, 8)

    if (!nextInstructionGroup)
      return messaging.sendDriverFinishedMessage(telegramId)

    await cache.setInstructionGroup(instructionGroupId, nextInstructionGroup)

    const bookings = await cache.getBookings(
      nextInstructionGroup.map((ig) => ig.id)
    )

    if (nextInstructionGroup[0].type === 'pickupShipment')
      messaging.sendPickupInformation(instructionGroupId, telegramId, bookings)

    if (nextInstructionGroup[0].type === 'deliverShipment')
      messaging.sendDeliveryInformation(
        nextInstructionGroup,
        instructionGroupId,
        telegramId,
        bookings
      )
    return cache.setInstructions(vehicleId, [...rest])
  } catch (error) {
    console.log(
      'error in handleDriverArrivedToPickupOrDeliveryPosition: ',
      error
    )
    return
  }
}
