const amqp = require('./amqp')
const {
  getVehicle,
  addVehicle,
  addInstructions,
  getInstructions,
} = require('./cache')
const messaging = require('./messaging')

const onLogin = (vehicleId, ctx) => {
  const oldVehicle = getVehicle(vehicleId)
  const telegramId = ctx.botInfo.id
  ctx.metadata.setVehicleIdFromTelegramId(telegramId, vehicleId)
  if (oldVehicle && oldVehicle.telegramId) {
    return
  }

  if (oldVehicle) {
    addVehicle(vehicleId, {
      ...oldVehicle,
      telegramId,
    })
  } else {
    addVehicle(vehicleId, { telegramId })
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
  const instructions = getInstructions(vehicleId)
  // if (!instructions)
  //   ctx.reply(
  //     'Vi hittade inte någon plan för ditt fordon, är du säker på att du har skrivt rätt id?'
  //   )

  const [first, ...rest] = instructions

  messaging.sendPickupInstructions(first, telegramId)
  addInstructions(vehicleId, rest)
}

module.exports = { onLogin, onMessage, handlePickupInstruction }
