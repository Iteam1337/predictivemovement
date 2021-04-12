import * as amqp from './amqp'
import cache from './cache'
import { v4 as uuid } from 'uuid'
import * as messaging from './messaging'
import {
  IncomingMessage,
  Message,
  PhotoSize,
} from 'telegraf/typings/telegram-types'
import { TelegrafContext } from 'telegraf/typings/context'
import { Instruction } from '../types'
import bot from '../adapters/bot'
import axios from 'axios'

export const driverIsLoggedIn = async (
  telegramId: number
): Promise<boolean> => {
  const vehicleId = await cache.getVehicleIdByTelegramId(telegramId)
  return !!vehicleId
}

export const onInstructionsReceived = async (
  telegramId: number,
  instructionGroups: Instruction[][]
): Promise<Message | void> => {
  if (await driverIsLoggedIn(telegramId)) {
    return messaging
      .sendSummary(telegramId, instructionGroups)
      .then(() => handleNextDriverInstruction(telegramId))
  }
}

const onDriverLoginSuccessful = async (
  telegramId: number,
  transportId: string
): Promise<Message | void> => {
  await messaging.sendWelcomeMsg(telegramId)

  amqp.publishTransportEvent(transportId, 'login')

  return cache
    .getInstructions(transportId)
    .then((instructionGroups: Instruction[][]) => {
      if (!instructionGroups) return

      cache
        .setTelegramIdByVehicleId(transportId, telegramId)
        .then(() =>
          messaging
            .sendSummary(telegramId, instructionGroups)
            .then(() => handleNextDriverInstruction(telegramId))
        )
    })
}

export const onLogin = async (
  phoneNumber: string,
  ctx: TelegrafContext
): Promise<Message | void> => {
  const vehicleId = await cache.getVehicleIdByPhoneNumber(
    phoneNumber.replace('+', '')
  )
  const vehicle = await cache.getVehicle(vehicleId)

  if (!vehicle) return messaging.onNoVehicleFoundFromId(ctx)
  const telegramId = ctx.update.message.from.id
  await cache.setVehicleIdByTelegramId(telegramId, vehicleId)
  await cache.addVehicle(vehicleId, {
    ...vehicle,
    telegramId,
  })
  return onDriverLoginSuccessful(telegramId, vehicleId)
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
    const transportId = await cache.getVehicleIdByTelegramId(telegramId)
    const instructions = await cache.getInstructions(transportId)

    if (!instructions) {
      console.log('No instructions found for:', transportId)
      return
    }

    if (!instructions.length) {
      console.log('Transport finished all instructions:', transportId)
      cache.setInstructions(transportId, null)
      amqp.publishTransportEvent(transportId, 'finished')
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

export const onManualReceiptConfirmed = async (
  instructionGroupId: string,
  telegramId: number
): Promise<Message> => {
  const [bookingId] = await cache
    .getInstructionGroup(instructionGroupId)
    .then((instructionGroup: Instruction[]) =>
      instructionGroup.map(({ id: bookingId }: Instruction) => bookingId)
    )

  const transportId = await cache.getVehicleIdByTelegramId(telegramId)

  return amqp
    .publishReceiptByManual({
      type: 'manual',
      bookingId: bookingId,
      createdAt: new Date(),
      transportId,
      signedBy: transportId,
    })
    .then((e) => {
      console.log('manual signature successfully received and sent to server')
      return e
    })
    .then(() => messaging.notifyManualSignatureConfirmed(telegramId))
}

export const onPhotoReceived = async (
  telegramId: number,
  photoSizes: PhotoSize[]
): Promise<Message> => {
  const instructionGroupId = await cache.getCurrentlyDeliveringInstructionGroupId(
    telegramId
  )
  if (!instructionGroupId) return messaging.sendCouldNotSavePhoto(telegramId)
  const highestResPhotoId = photoSizes[photoSizes.length - 1].file_id
  const bookingIds = await cache
    .getCurrentlyDeliveringInstructionGroupId(telegramId)
    .then(cache.getInstructionGroup)
    .then((instructionGroup: Instruction[]) =>
      instructionGroup.map(({ id: bookingId }: Instruction) => bookingId)
    )
  const transportId = await cache.getVehicleIdByTelegramId(telegramId)
  const fileLink = await bot.telegram.getFileLink(highestResPhotoId)
  const response = await axios.get(fileLink, {
    responseType: 'arraybuffer',
  })
  let photo = Buffer.from(response.data, 'binary').toString('base64')

  if (!photo.match(/^data:image\/jpg;base64,/)) {
    photo = `data:image/jpg;base64,${photo}`
  }

  return amqp
    .publishReceiptByPhoto({
      type: 'photo',
      bookingId: bookingIds[0],
      createdAt: new Date(),
      transportId,
      receipt: {
        photo,
        photoId: highestResPhotoId,
      },
      signedBy: transportId,
    })

    .then(() => messaging.sendPhotoReceived(telegramId))
    .then((e) => {
      console.log('photo successfully received and sent to server')
      return e
    })
}

export const beginDeliveryAcknowledgement = async (
  telegramId: number,
  instructionGroupId: string
): Promise<Message> =>
  cache
    .setDriverCurrentlyDeliveringInstructionGroupId(
      telegramId,
      instructionGroupId
    )
    .then(() =>
      messaging.sendBeginDeliveryAcknowledgement(telegramId, instructionGroupId)
    )

export const handleIncomingSignatureConfirmation = async (
  transportId: string
): Promise<Message> => {
  const telegramId = Number(await cache.getTelegramIdByVehicleId(transportId))

  const instructionGroupId = await cache.getCurrentlyDeliveringInstructionGroupId(
    telegramId
  )

  return messaging.sendSignatureConfirmation(telegramId, instructionGroupId)
}

export const handleDeliveryAcknowledgementByPhoto = (
  telegramId: number
): Promise<Message> => messaging.sendDeliveryAcknowledgementByPhoto(telegramId)

export const handleDeliveryAcknowledgementManual = (
  instructionGroupId: string,
  telegramId: number
): Promise<Message> =>
  messaging.acceptManualSignature(instructionGroupId, telegramId)

export const handleCancelDeliveryAcknowledgement = (
  instructionGroupId: string,
  telegramId: number
): Promise<Message> =>
  messaging.handleCancelDeliveryAcknowledgement(instructionGroupId, telegramId)

export async function onArrived(msg): Promise<Message | string> {
  const telegramId = msg.update.callback_query.from.id
  const vehicleId = await cache.getVehicleIdByTelegramId(telegramId)

  return handleDriverArrivedToPickupOrDeliveryPosition(vehicleId, telegramId)
}

export const handleFinishBookingInstructionGroup = (
  instructionGroupId: string,
  event: string,
  telegramId: number
): Promise<Message> =>
  cache
    .getAndDeleteInstructionGroup(instructionGroupId)
    .then((instructionGroup: Instruction[]) =>
      Promise.all(
        instructionGroup.map(({ id: bookingId }: Instruction) =>
          amqp.publishBookingEvent(bookingId, event)
        )
      )
    )
    .then(() => handleNextDriverInstruction(telegramId))
