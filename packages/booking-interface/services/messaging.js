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
    `Din bokning har nu bekräftats för leverans! Förare: ${carId}`
  )
}

const onPickupConfirmed = () => {
  bot.telegram.sendMessage(senderId, `Din bokning har nu blivit upplockad!`)
}

const onDeliveryConfirmed = () => {
  bot.telegram.sendMessage(
    senderId,
    `Din bokning har nu anlänt till sin destination!`
  )
}

module.exports = {
  onBotStart,
  onBookingConfirmed,
  onPickupConfirmed,
  onDeliveryConfirmed,
}
