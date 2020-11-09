import * as amqp from './amqp'
import cache from './cache'
import { v4 as uuid } from 'uuid'

import * as messaging from './messaging'
import { IncomingMessage, Message } from 'telegraf/typings/telegram-types'
import { TelegrafContext } from 'telegraf/typings/context'
import { Instruction } from '../types'

export const driverIsLoggedIn = async (
  telegramId: number
): Promise<boolean> => {
  const vehicleId = await cache.getVehicleIdByTelegramId(telegramId)
  return !!vehicleId
}

export const onInstructionsReceived = async (
  telegramId: number,
  instructions: Instruction[][]
): Promise<Message | void> => {
  if (await driverIsLoggedIn(telegramId)) {
    return messaging
      .sendSummary(telegramId, instructions)
      .then(() => handleNextDriverInstruction(telegramId))
  }
}

export const onLogin = async (
  phoneNumber: string,
  ctx: TelegrafContext
): Promise<Message | void> => {
  const vehicleId = await cache.getVehicleIdByPhoneNumber(
    phoneNumber.replace('+', '').replace('46', '0')
  )
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
  msg: IncomingMessage
): Promise<void> => {
  const vehicleId = await cache.getVehicleIdByTelegramId(msg.from.id)

  const message = {
    location: {
      lon: msg.location.longitude,
      lat: msg.location.latitude,
    },
    id: vehicleId,
  }

  amqp.updateLocation(message)
}

export const handleNextDriverInstruction = async (
  telegramId: number
): Promise<Message> => {
  try {
    const vehicleId = await cache.getVehicleIdByTelegramId(telegramId)
    const instructions = await cache.getInstructions(vehicleId)

    if (!instructions) {
      console.log('No instructions found for:', vehicleId)
      return
    } else if (!instructions.length) {
      console.log('Vehicle finished all instructions:', vehicleId)
      cache.setInstructions(vehicleId, null)
      return messaging.sendDriverFinishedMessage(telegramId)
    }
    const [currentInstructionGroup] = instructions

    const bookings = await cache.getBookings(
      currentInstructionGroup.map((g) => g.id)
    )

    switch (currentInstructionGroup[0].type) {
      case 'pickupShipment':
        return messaging.sendPickupInstruction(
          currentInstructionGroup,
          telegramId,
          bookings
        )
      case 'deliverShipment':
        return messaging.sendDeliveryInstruction(
          currentInstructionGroup,
          telegramId,
          bookings
        )
    }
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

    if (!nextInstructionGroup) {
      cache.setInstructions(vehicleId, null)
      return messaging.sendDriverFinishedMessage(telegramId)
    }

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
