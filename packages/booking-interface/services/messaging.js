const bot = require('../adapters/bot')

const onBotStart = (ctx) => {
  const {
    first_name,

    last_name,

    id,
  } = ctx.update.message.from

  ctx.reply(
    `Välkommen ${first_name} ${last_name}! Skriv "/boka" För att skapa en bokning. Ditt id är ${id}`
  )
}

const onBookingConfirmed = (senderId, carId) => {
  bot.telegram.sendMessage(
    senderId,
    `Din bokning har accepterats av förare ${carId}`
  )
}

const onPickupConfirmed = (senderId) => {
  bot.telegram.sendMessage(senderId, `Din bokning har blivit hämtad!`)
}

const onDeliveryConfirmed = (senderId) => {
  bot.telegram.sendMessage(senderId, `Din bokning har kommit fram!`)
}

module.exports = {
  onBotStart,
  onBookingConfirmed,
  onPickupConfirmed,
  onDeliveryConfirmed,
}
