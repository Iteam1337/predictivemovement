const helpers = require('../helpers')
const amqp = require('./amqp')
const cache = require('./cache')
const { v4: uuid } = require('uuid')

const messaging = require('./messaging')

const onLogin = async (vehicleId, ctx) => {
  const vehicle = await cache.getVehicle(vehicleId)

  if (!vehicle) return messaging.onNoVehicleFoundFromId(ctx)
  const telegramId = ctx.update.message.from.id
  await cache.setVehicleIdByTelegramId(telegramId, vehicleId)

  if (vehicle.telegramId) {
    return
  }

  const groupedInstructions = helpers.groupDriverInstructions(
    helpers.cleanDriverInstructions(vehicle.activities)
  )

  await cache.setInstructions(vehicle.id, groupedInstructions)

  await cache.addVehicle(vehicleId, {
    ...vehicle,
    telegramId,
  })

  return messaging
    .onDriverLoginSuccessful(ctx)
    .then(() => handleNextDriverInstruction(telegramId))
}

const onLocationMessage = (msg, ctx) => {
  const position = {
    lon: msg.location.longitude,
    lat: msg.location.latitude,
  }

  const telegramMetadata = {
    username: msg.from.username,
    senderId: msg.from.id,
  }

  const message = {
    start_address: position,
    metadata: {
      telegram: telegramMetadata,
    },
  }

  amqp.updateLocation(message, ctx)
}

const handleNextDriverInstruction = async (telegramId) => {
  try {
    const vehicleId = await cache.getVehicleIdByTelegramId(telegramId)
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
    console.log(
      'error in handleDriverArrivedToPickupOrDeliveryPosition: ',
      error
    )
    return
  }
}

const handleDriverArrivedToPickupOrDeliveryPosition = async (
  vehicleId,
  telegramId
) => {
  try {
    const instructionGroups = await cache.getInstructions(vehicleId)

    const [nextInstructionGroup, ...rest] = instructionGroups

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
    console.log('error in handleNextDriverInstruction: ', error)
    return
  }
}

module.exports = {
  onLogin,
  onLocationMessage,
  handleNextDriverInstruction,
  handleDriverArrivedToPickupOrDeliveryPosition,
}
