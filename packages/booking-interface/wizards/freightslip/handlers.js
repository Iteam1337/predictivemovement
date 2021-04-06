const { Markup } = require('telegraf')
const Composer = require('telegraf/composer')
const bot = require('../../adapters/bot')
const services = require('../../services')
const utils = require('../../utils')
const wizardHelpers = require('../helpers')

const awaitManualSenderInput = new Composer().on('text', (ctx) =>
  services.geolocation.get(ctx.update.message.text).then((res) => {
    if (!res || !res.length) {
      return wizardHelpers.jumpToStep(ctx, 'notifyNoGeolocationResult')
    }

    const { state } = ctx.scene.session
    const [suggestion] = res

    Object.assign(state, {
      suggestedSender: suggestion,
    })

    return ctx
      .replyWithMarkdown(
        `Är detta rätt?`.concat(`\n\n${suggestion.properties.label}`),
        Markup.inlineKeyboard([
          Markup.callbackButton('Ja', 'sender:geolookup:confirm'),
          Markup.callbackButton('Nej', 'sender:geolookup:decline'),
        ]).extra()
      )
      .then(() => ctx.wizard.next())
  })
)

const awaitManualRecipientInput = new Composer().on('text', (ctx) =>
  services.geolocation.get(ctx.update.message.text).then((res) => {
    if (!res || !res.length) {
      return wizardHelpers.jumpToStep(ctx, 'notifyNoGeolocationResult')
    }

    const { state } = ctx.scene.session
    const [suggestion] = res

    Object.assign(state, {
      suggestedRecipient: suggestion,
    })

    return ctx
      .replyWithMarkdown(
        `Är detta rätt?`.concat(`\n\n${suggestion.properties.label}`),
        Markup.inlineKeyboard([
          Markup.callbackButton('Ja', 'recipient:geolookup:confirm'),
          Markup.callbackButton('Nej', 'recipient:geolookup:decline'),
        ]).extra()
      )
      .then(() => ctx.wizard.next())
  })
)

const awaitManualContactConfirmation = new Composer()
  .action('sender:geolookup:confirm', (ctx) => {
    const { state } = ctx.scene.session

    state.booking = Object.assign({}, state.booking, {
      id: services.booking.makeId(),
      from: Object.assign({}, state.booking.from, state.suggestedSender),
    })

    return wizardHelpers.jumpToStep(ctx, 'askAddAdditionalInformation')
  })
  .action('recipient:geolookup:confirm', (ctx) => {
    const { state } = ctx.scene.session

    if (state.booking && state.booking.from) {
      // sender has already been entered
      // and we shouldn't do that again.

      state.booking = Object.assign({}, state.booking, {
        id: services.booking.makeId(),
        to: Object.assign({}, state.booking.to, state.suggestedRecipient),
      })

      return wizardHelpers.jumpToStep(ctx, 'askAddAdditionalInformation')
    }

    return wizardHelpers.jumpToStep(ctx, 'askForLocation')
  })
  .action('recipient:geolookup:decline', (ctx) => {
    console.log('***declines recipient lookup suggestion***')
  })
  .action('sender:geolookup:decline', (ctx) => {
    console.log('***declines recipient lookup suggestion***')
  })

const awaitAdditionalInformationOrConfirm = new Composer()
  .action('booking:confirm', (ctx) => {
    return wizardHelpers.jumpToStep(ctx, 'intro')
  })
  .action('booking:add_extra', (ctx) => {
    console.log('booking wants extra')
  })

const awaitRetryUploadOrManual = new Composer()
  .action('retry_upload', (ctx) =>
    wizardHelpers.jumpToStep(ctx, 'askForUpload')
  )
  .action('enter_manual', (ctx) => {
    wizardHelpers.jumpToStep(ctx, 'askForManualRecipient')
  })

const awaitHasFreightslip = new Composer()
  .action('freightslip:confirm', (ctx) =>
    wizardHelpers.jumpToStep(ctx, 'askForUpload')
  )
  .action('freightslip:decline', (ctx) =>
    wizardHelpers.jumpToStep(ctx, 'askForManualRecipient')
  )

const awaitSenderOrRecipientConfirmation = new Composer()
  .action('freightslip:is_sender', (ctx) => {
    const { state } = ctx.scene.session
    state.booking = { from: state.matches[0] }
    return wizardHelpers.jumpToStep(ctx, 'askForManualRecipient')
  })
  .action('freightslip:is_recipient', (ctx) => {
    const { state } = ctx.scene.session
    state.booking = { to: state.matches[0] }
    return wizardHelpers.jumpToStep(ctx, 'askForLocation')
  })

const awaitLocationAlternativeSelect = new Composer()
  .action('location:from_location', (ctx) =>
    wizardHelpers.jumpToStep(ctx, 'askForSenderLocationConfirm')
  )
  .action('location:from_manual', (ctx) =>
    wizardHelpers.jumpToStep(ctx, 'askForManualSender')
  )
  .action('location:from_freightslip', (ctx) => {})

const awaitSenderLocationConfirm = new Composer()
  .on('location', (ctx) => {
    const { state } = ctx.scene.session

    state.booking = Object.assign({}, state.booking, {
      from: Object.assign({}, state.booking.from, {
        location: ctx.message.location,
      }),
    })

    return wizardHelpers.jumpToStep(ctx, 'askAddAdditionalInformation')
  })
  .action('location:cancel', (ctx) =>
    wizardHelpers.jumpToStep(ctx, 'askForManualRecipient')
  )

const notifyNoGeolocationResult = (ctx) =>
  ctx
    .reply(`Vi fick ingen träff på denna adress och detta namn...`)
    .then(() => wizardHelpers.jumpToStep(ctx, 'intro'))

const askForManualRecipient = (ctx) =>
  ctx.reply('Skriv in mottagaradressen').then(() => ctx.wizard.next())

const askForManualRecipientAfterSender = (ctx) =>
  ctx.reply('Skriv in mottagaradressen').then(() => ctx.wizard.next())

const askForManualSender = (ctx) =>
  ctx.reply('Skriv in avsändaradressen').then(() => ctx.wizard.next())

const askAddAdditionalInformation = (ctx) =>
  ctx
    .replyWithMarkdown(
      `Tack. Då har du fått bokningsnummer: ${ctx.scene.session.state.booking.id}. Anteckna detta på försändelsen.`,
      Markup.inlineKeyboard([
        Markup.callbackButton('Fyll i fler detaljer', 'booking:add_extra'),
        Markup.callbackButton('Påbörja nästa bokning', 'booking:confirm'),
      ]).extra()
    )
    .then(() => ctx.wizard.next())

const askForLocation = (ctx) => {
  return ctx
    .replyWithMarkdown(
      `Tack! Vill du skicka din nuvarande position som avsändaradress?`,
      Markup.inlineKeyboard([
        Markup.callbackButton('Ja', 'location:from_location'),
        Markup.callbackButton(
          'Nej, hämta från fraktsedeln',
          'location:from_freightslip'
        ),
        Markup.callbackButton('Nej, skriv in manuellt', 'location:from_manual'),
      ]).extra()
    )
    .then(() => ctx.wizard.next())
}

const intro = (ctx) =>
  ctx
    .replyWithMarkdown(
      `Har din försändelse en fraktsedel?`,
      Markup.inlineKeyboard([
        Markup.callbackButton('Ja', 'freightslip:confirm'),
        Markup.callbackButton('Nej', 'freightslip:decline'),
      ]).extra()
    )
    .then(() => ctx.wizard.next())

const askForUpload = (ctx) => {
  return ctx
    .reply(
      'Ta en bild på fraktsedeln eller addresslappen och skicka den till mig!'.concat(
        `\nFörsök ta bilden så nära det går och i så bra ljus som möjligt.`
      )
    )
    .then(() => ctx.wizard.next())
}

const awaitImageUpload = new Composer().on('photo', async (ctx) => {
  const photos = ctx.update.message.photo
  const [{ file_id }] = Array.from(photos).reverse()

  const fileLink = await services.bot.getFileLink(bot, file_id)

  try {
    const text = await services.text.getTextFromPhoto(fileLink)

    if (!text) {
      return wizardHelpers.jumpToStep(ctx, 'noParseTextFromImageResult')
    }

    const regexResult = Array.from(text.matchAll(utils.adress))
      .map((res) => res.groups)
      .filter((group) => group.street && group.nr && group.zipcode)
      .map((x) =>
        // do something better here
        Object.assign({}, x, { zipcode: x.zipcode.replace('SE-', '') })
      )

    const elasticRes = await Promise.all(regexResult.map(services.elastic.get))

    const searchResults = elasticRes
      .map((res) => res.body)
      .map(services.formatQueryResult)

    if (!searchResults.length) {
      return wizardHelpers.jumpToStep(ctx, 'noParseTextFromImageResult')
    }

    ctx.scene.session.state = Object.assign(ctx.scene.session.state, {
      matches: searchResults,
    })

    return wizardHelpers.jumpToStep(ctx, 'askForSenderOrRecipientConfirmation')
  } catch (error) {
    console.warn('something went wrong in awaitImageUpload: ', error)
  }
})

const noParseTextFromImageResult = (ctx) => {
  return ctx
    .replyWithMarkdown(
      `Vi kunde inte tolka bilden. Vill du försöka igen?`,
      Markup.inlineKeyboard([
        Markup.callbackButton('Ja', 'retry_upload'),
        Markup.callbackButton('Nej', 'enter_manual'),
      ]).extra()
    )
    .then(() => ctx.wizard.next())
}

const askForSenderOrRecipientConfirmation = (ctx) => {
  const [match] = ctx.scene.session.state.matches || []

  if (!match) return // enter manually or something

  return ctx
    .replyWithMarkdown(
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
    .then(() => ctx.wizard.next())
}

const askForSenderLocationConfirm = (ctx) => {
  return ctx
    .reply('Klicka på knappen för att dela position.', {
      reply_markup: Markup.keyboard([
        Markup.locationRequestButton('📍 Dela position'),
        Markup.callbackButton('Avbryt', 'location:cancel'),
      ]).oneTime(),
    })

    .then(() => ctx.wizard.next())
}

module.exports = [
  intro,
  awaitHasFreightslip,
  askForUpload,
  awaitImageUpload,
  askForSenderOrRecipientConfirmation,
  awaitSenderOrRecipientConfirmation,
  askForLocation,
  awaitLocationAlternativeSelect,
  askForSenderLocationConfirm,
  awaitSenderLocationConfirm,
  askAddAdditionalInformation,
  awaitAdditionalInformationOrConfirm,
  noParseTextFromImageResult,
  awaitRetryUploadOrManual,
  askForManualRecipient,
  awaitManualRecipientInput,
  awaitManualContactConfirmation,
  notifyNoGeolocationResult,
  askForManualSender,
  awaitManualSenderInput,
  awaitManualContactConfirmation,
  askForManualRecipientAfterSender,
  awaitManualContactConfirmation,
]
