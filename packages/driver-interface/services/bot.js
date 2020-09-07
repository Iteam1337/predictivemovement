const amqp = require('./amqp')
const { getVehicle, addVehicle } = require('./cache')

const onLogin = (vehicleId, ctx) => {
  const oldVehicle = getVehicle(vehicleId)
  const telegramId = ctx.botInfo.id
  ctx.metadata.setId(telegramId, vehicleId)
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

module.exports = { onLogin, onMessage }
