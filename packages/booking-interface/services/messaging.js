const bot = require('../adapters/bot')
const moment = require('moment')

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

const onBookingConfirmed = (senderId, carId, events) => {
  bot.telegram.sendMessage(
    senderId,
    `Din bokning har accepterades av förare ${carId}, ${moment(events.timestamp)
      .local()
      .format('ddd, MMM DD YYYY, h:mm')}`
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
