const bot = require('../adapters/bot')
const moment = require('moment')

const onBotStart = (ctx) =>
  ctx.reply(
    `Välkommen till Predictive Movement.\nHär kan du lägga upp bokningar i systemet med hjälp av kameran i din telefon.`
  )

const onBookingConfirmed = (senderId, carId, events) => {
  bot.telegram.sendMessage(
    senderId,
    `Din bokning har accepterades av förare ${carId}, ${moment(
      events[0].timestamp
    )
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
