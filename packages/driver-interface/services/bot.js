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
  const currentVehicle = getVehicle(vehicleId)
  if (!currentVehicle)
    return ctx.reply('Inget fordon som matchar ditt angivna ID kunde hittas...')

  const telegramId = ctx.update.message.from.id

  ctx.metadata.setVehicleIdFromTelegramId(telegramId, vehicleId)

  if (currentVehicle && currentVehicle.telegramId) {
    return
  }

  if (currentVehicle) {
    setInstructions(currentVehicle.id, currentVehicle.activities.slice(1, -1))
    addVehicle(vehicleId, {
      ...currentVehicle,
      telegramId,
    })
  } else {
    addVehicle(vehicleId, { telegramId })
  }

  return ctx
    .reply(
      'Tack! Du kommer nu få instruktioner för hur du ska hämta upp de bokningar som du har tilldelats.'
    )
    .then(() => handlePickupInstruction(vehicleId, ctx.update.message.from.id))
}

const onMessage = (msg, ctx) => {
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

const handlePickupInstruction = (vehicleId, telegramId) => {
  try {
    const instructions = getInstructions(vehicleId)

    const [nextInstruction, ...rest] = instructions

    if (!nextInstruction) return messaging.sendDriverFinishedMessage(telegramId)
    const booking = getBooking(nextInstruction.id)

    if (nextInstruction.type === 'pickupShipment')
      messaging.sendPickupInstruction(nextInstruction, telegramId, booking)

    if (nextInstruction.type === 'deliverShipment')
      messaging.sendDeliveryInstruction(nextInstruction, telegramId, booking)

    setInstructions(vehicleId, rest)
  } catch (error) {
    console.log('error in handlePickupINstructions: ', error)
    return
  }
}

module.exports = { onLogin, onMessage, handlePickupInstruction }
