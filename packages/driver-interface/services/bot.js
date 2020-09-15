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
    .then(() => handleOnArrive(vehicleId, ctx.update.message.from.id))
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

const handleOnArrive = (vehicleId, telegramId) => {
  try {
    const [current] = getInstructions(vehicleId)

    if (!current) return messaging.sendDriverFinishedMessage(telegramId)
    const booking = getBooking(current.id)

    if (current.type === 'pickupShipment')
      messaging.sendPickupInstruction(current, telegramId, booking)

    if (current.type === 'deliverShipment')
      messaging.sendDeliveryInstruction(current, telegramId, booking)
  } catch (error) {
    console.log('error in handlePickupInstructions: ', error)
    return
  }
}

const handlePickupInstruction = (vehicleId, telegramId) => {
  try {
    const instructions = getInstructions(vehicleId)

    const [nextInstruction, ...rest] = instructions

    if (!nextInstruction) return messaging.sendDriverFinishedMessage(telegramId)
    const booking = getBooking(nextInstruction.id)

    if (nextInstruction.type === 'pickupShipment')
      messaging.sendPickupInformation(nextInstruction, telegramId, booking)

    if (nextInstruction.type === 'deliverShipment')
      messaging.sendDeliveryInformation(nextInstruction, telegramId, booking)

    setInstructions(vehicleId, rest)
  } catch (error) {
    console.log('error in handlePickupInstructions: ', error)
    return
  }
}

module.exports = {
  onLogin,
  onLocationMessage,
  handlePickupInstruction,
  handleOnArrive,
}
