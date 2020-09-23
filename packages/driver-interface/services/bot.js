const helpers = require('../helpers')
const amqp = require('./amqp')
const {
  getVehicle,
  addVehicle,
  setInstructions,
  getInstructions,
} = require('./cache')
const { getBooking } = require('./cache')

const messaging = require('./messaging')

const onLogin = (vehicleId, ctx) => {
  const vehicle = getVehicle(vehicleId)
  if (!vehicle)
    return ctx.reply('Inget fordon som matchar ditt angivna ID kunde hittas...')

  const telegramId = ctx.update.message.from.id

  ctx.metadata.setVehicleIdFromTelegramId(telegramId, vehicleId)

  if (vehicle.telegramId) {
    return
  }

  setInstructions(
    vehicle.id,
    helpers.cleanDriverInstructions(vehicle.activities)
  )

  addVehicle(vehicleId, {
    ...vehicle,
    telegramId,
  })

  return ctx
    .reply(
      'Tack! Du kommer nu få instruktioner för hur du ska hämta upp de bokningar som du har tilldelats.'
    )
    .then(() =>
      handleDriverArrivedToPickupOrDeliveryPosition(
        vehicleId,
        ctx.update.message.from.id
      )
    )
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

const handleDriverArrivedToPickupOrDeliveryPosition = (
  vehicleId,
  telegramId
) => {
  try {
    const [current] = getInstructions(vehicleId)

    if (!current) return messaging.sendDriverFinishedMessage(telegramId)
    const booking = getBooking(current.id)

    if (current.type === 'pickupShipment')
      return messaging.sendPickupInstruction(current, telegramId, booking)

    if (current.type === 'deliverShipment')
      return messaging.sendDeliveryInstruction(current, telegramId, booking)
  } catch (error) {
    console.log('error in handlePickupInstructions: ', error)
    return
  }
}

const handleNextDriverInstruction = (vehicleId, telegramId) => {
  try {
    const instructions = getInstructions(vehicleId)
    const [nextInstruction, ...rest] = instructions

    if (!nextInstruction) return messaging.sendDriverFinishedMessage(telegramId)
    const booking = getBooking(nextInstruction.id)

    if (nextInstruction.type === 'pickupShipment')
      messaging.sendPickupInformation(nextInstruction, telegramId, booking)

    if (nextInstruction.type === 'deliverShipment')
      messaging.sendDeliveryInformation(nextInstruction, telegramId, booking)

    return setInstructions(vehicleId, [...rest])
  } catch (error) {
    console.log('error in handlePickupInstructions: ', error)
    return
  }
}

module.exports = {
  onLogin,
  onLocationMessage,
  handleNextDriverInstruction,
  handleDriverArrivedToPickupOrDeliveryPosition,
}
