const bot = require('../adapters/bot')
const moment = require('moment')
const { Markup } = require('telegraf')

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

const onBookingCreated = (senderId, booking) => {
  const url = `http://127.0.0.1:3000/bookings/edit-booking/${booking.id}`
  return bot.telegram.sendMessage(
    senderId,
    `Då har du fått bokningsnummer:\n\n${booking.id}\n\nAnteckna detta på försändelsen.`
      .concat(`\nSå här ser din bokning ut:`)
      .concat(`\n\nFrån:\n`)
      .concat(
        booking.pickup.street && booking.pickup.housenumber
          ? `${booking.pickup.street} ${booking.pickup.housenumber}`
          : booking.pickup.name
      )

      .concat(booking.pickup.postalcode ? `\n${booking.pickup.postalcode}` : '')
      .concat(booking.pickup.locality ? `\n${booking.pickup.locality}` : '')
      .concat(`\n\nTill:\n`)
      .concat(
        booking.delivery.street
          ? `${booking.delivery.street}`
          : booking.delivery.name
      )
      .concat(
        booking.delivery.postalcode ? `\n${booking.delivery.postalcode}` : ''
      )
      .concat(
        booking.delivery.locality ? `\n${booking.delivery.locality}` : ''
      ),

    Markup.inlineKeyboard([
      Markup.urlButton('Fyll i fler detaljer', url),
      Markup.callbackButton('Påbörja nästa', 'booking:confirm'),
    ]).extra()
  )
}

module.exports = {
  onBotStart,
  onBookingConfirmed,
  onPickupConfirmed,
  onDeliveryConfirmed,
  onBookingCreated,
}
