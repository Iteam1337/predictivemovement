const amqp = require('./amqp')
const {
  getVehicle,
  addVehicle,
  setInstructions,
  getInstructions,
} = require('./cache')
const messaging = require('./messaging')

const onLogin = (vehicleId, ctx) => {
  const currentVehicle = getVehicle(vehicleId)
  const telegramId = ctx.botInfo.id
  ctx.metadata.setVehicleIdFromTelegramId(telegramId, vehicleId)

  if (currentVehicle && currentVehicle.telegramId) {
    return
  }
  console.log('setting instructions')
  setInstructions(currentVehicle.id, currentVehicle.activities.slice(1, -1))
  if (currentVehicle) {
    return addVehicle(vehicleId, {
      ...currentVehicle,
      telegramId,
    })
  } else {
    return addVehicle(vehicleId, { telegramId })
  }
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

    // if (!instructions)
    //   ctx.reply(
    //     'Vi hittade inte någon plan för ditt fordon, är du säker på att du har skrivt rätt id?'
    //   )

    const [first, ...rest] = instructions

    messaging.sendPickupInstructions(first, telegramId)
    setInstructions(vehicleId, rest)
  } catch (error) {
    console.log('error in handlePickupINstructions: ', error)
    return
  }
}

module.exports = { onLogin, onMessage, handlePickupInstruction }
