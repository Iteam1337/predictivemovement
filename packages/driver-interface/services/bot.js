const helpers = require('../helpers')
const amqp = require('./amqp')
const cache = require('./cache')

const messaging = require('./messaging')

const onLogin = async (vehicleId, ctx) => {
  const vehicle = await cache.getVehicle(vehicleId)

  if (!vehicle) return messaging.onNoVehicleFoundFromId(ctx)

  const telegramId = ctx.update.message.from.id
  await cache.setVehicleIdByTelegramId(telegramId, vehicleId)

  if (vehicle.telegramId) {
    return
  }

  await cache.setInstructions(
    vehicle.id,
    helpers.cleanDriverInstructions(vehicle.activities)
  )

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
    const [currentInstruction] = await cache.getInstructions(vehicleId)

    if (!currentInstruction)
      return messaging.sendDriverFinishedMessage(telegramId)

    const booking = await cache.getBooking(currentInstruction.id)

    if (currentInstruction.type === 'pickupShipment')
      return messaging.sendPickupInstruction(
        currentInstruction,
        telegramId,
        booking
      )

    if (currentInstruction.type === 'deliverShipment')
      return messaging.sendDeliveryInstruction(
        currentInstruction,
        telegramId,
        booking
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
    const instructions = await cache.getInstructions(vehicleId)
    const [nextInstruction, ...rest] = instructions

    if (!nextInstruction) return messaging.sendDriverFinishedMessage(telegramId)
    const booking = await cache.getBooking(nextInstruction.id)

    if (nextInstruction.type === 'pickupShipment')
      messaging.sendPickupInformation(nextInstruction, telegramId, booking)

    if (nextInstruction.type === 'deliverShipment')
      messaging.sendDeliveryInformation(nextInstruction, telegramId, booking)

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
