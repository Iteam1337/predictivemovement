const { Markup } = require('telegraf')
const { createBooking } = require('../../services/amqp')
const { v4: uuidv4 } = require('uuid') // https://www.npmjs.com/package/id62

const greet = (ctx) =>
  ctx.replyWithMarkdown(
    `Har din försändelse en fraktsedel?`,
    Markup.inlineKeyboard([
      Markup.callbackButton('Ja', 'freightslip:confirm'),
      Markup.callbackButton('Nej', 'freightslip:decline'),
    ]).extra()
  )

const askForUpload = (ctx) =>
  ctx.reply(
    'Ta en bild på fraktsedeln eller addresslappen och skicka den till mig!'.concat(
      `\nFörsök ta bilden så nära det går och i så bra ljus som möjligt.`
    )
  )

const askForSenderLocation = (ctx) =>
  ctx.replyWithMarkdown(
    `Hur vill du ange avsändaradressen?`,
    Markup.inlineKeyboard([
      Markup.callbackButton('Dela position', 'location:from_location'),
      Markup.callbackButton('Manuellt', 'location:from_manual'),
    ]).extra()
  )

const askAddAdditionalInformation = (ctx, booking) => {
  const senderId = ctx.update.callback_query.from.id

  const bookingToCreate = {
    external_id: uuidv4(),
    pickup: {
      name: booking.from.name,
      lon: booking.from.coordinates.lon,
      lat: booking.from.coordinates.lat,
      street: booking.from.street,
      city: booking.from.locality,
    },
    delivery: {
      name: booking.to.name,
      lat: booking.to.coordinates.lat,
      lon: booking.to.coordinates.lon,
      street: booking.to.street,
      city: booking.to.locality,
    },
    metadata: {
      telegram: {
        senderId,
      },
      customer: '',
      cargo: '',
      fragile: false,
      recipient: { name: '', contact: '', info: '' },
      sender: { name: '', contact: '', info: '' },
    },
    size: { weight: 1, measurements: [18, 18, 18] },
  }

  createBooking(bookingToCreate)
  return ctx.replyWithMarkdown('Din bokning skapas..')
}

const informNoSuggestedSenders = (ctx) => {
  ctx.reply('Det finns inga förslagna adresser.')
}

const informNoSuggestedRecipients = (ctx) => {
  ctx.reply('Det finns inga förslagna adresser.')
}

const askIfCorrectSuggestedSender = (ctx) => {
  const { state } = ctx.scene.session

  if (!state.suggestedSenders)
    return ctx.reply('Vi kunde inte hitta några föreslagna adresser :(')

  const [suggestion] = state.suggestedSenders

  return ctx.replyWithMarkdown(
    `Är detta rätt?\n\n`
      .concat(
        suggestion.street && suggestion.housenumber
          ? `${suggestion.street} ${suggestion.housenumber}`
          : suggestion.name
      )
      .concat(suggestion.postalcode ? `\n${suggestion.postalcode}` : '')
      .concat(suggestion.locality ? `\n${suggestion.locality}` : ''),
    Markup.inlineKeyboard([
      Markup.callbackButton('Ja', 'sender:geolookup:confirm'),
      Markup.callbackButton('Nej', 'sender:geolookup:decline'),
    ]).extra()
  )
}

const askIfCorrectSuggestedRecipient = (ctx) => {
  const { state } = ctx.scene.session

  if (!state.suggestedRecipients)
    return ctx.reply('Vi kunde inte hitta några föreslagna adresser :(')

  const [suggestion] = state.suggestedRecipients

  return ctx.replyWithMarkdown(
    `Är detta rätt?\n\n`
      .concat(
        suggestion.street && suggestion.housenumber
          ? `${suggestion.street} ${suggestion.housenumber}`
          : suggestion.name
      )
      .concat(suggestion.postalcode ? `\n${suggestion.postalcode}` : '')
      .concat(suggestion.locality ? `\n${suggestion.locality}` : ''),
    Markup.inlineKeyboard([
      Markup.callbackButton('Ja', 'recipient:geolookup:confirm'),
      Markup.callbackButton('Nej', 'recipient:geolookup:decline'),
    ]).extra()
  )
}

const notifyNoGeolocationResult = (ctx) =>
  ctx.reply(`Vi fick ingen träff på denna adress och detta namn...`)

const askForManualRecipient = (ctx) => ctx.reply('Ange mottagaradressen')

const askForManualSender = (ctx) => ctx.reply('Ange avsändaradressen')

const noParseTextFromImageResult = (ctx) =>
  ctx.replyWithMarkdown(
    `Vi kunde inte tolka bilden. Vill du försöka igen?`,
    Markup.inlineKeyboard([
      Markup.callbackButton('Ja', 'retry_upload'),
      Markup.callbackButton('Nej', 'enter_manual'),
    ]).extra()
  )

const askForSenderOrRecipientConfirmation = (ctx) => {
  const [match] = ctx.scene.session.state.matches || []

  if (!match) return // enter manually or something

  return ctx.replyWithMarkdown(
    `Så här tolkade vi bilden:`
      .concat(`\n\n${match.address.street} ${match.address.number}`)
      .concat(`\n${match.address.zip}`)
      .concat(`\n${match.locality}`)
      .concat(`\n\nÄr detta avsändare eller mottagare?`),
    Markup.inlineKeyboard(
      [
        Markup.callbackButton('Mottagare', 'freightslip:is_recipient'),
        Markup.callbackButton('Avsändare', 'freightslip:is_sender'),
        Markup.callbackButton('Ingetdera', 'freightslip:is_neither'),
      ],
      { resize_keyboard: true }
    ).extra()
  )
}

const askForSenderLocationConfirm = (ctx) =>
  ctx.reply('Klicka på knappen för att dela position.', {
    reply_markup: Markup.keyboard([
      Markup.locationRequestButton('📍 Dela position'),
      Markup.callbackButton('Avbryt', 'location:cancel'),
    ]).oneTime(),
  })

module.exports = {
  greet,
  noParseTextFromImageResult,
  askForUpload,
  askForSenderOrRecipientConfirmation,
  askForSenderLocationConfirm,
  askForSenderLocation,
  askAddAdditionalInformation,
  informNoSuggestedSenders,
  informNoSuggestedRecipients,
  askIfCorrectSuggestedSender,
  askIfCorrectSuggestedRecipient,
  notifyNoGeolocationResult,
  askForManualRecipient,
  askForManualSender,
}
