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

    state.suggestedSenders = res.map((r) => ({
      name: r.properties.name,
      street: r.properties.street,
      housenumber: r.properties.housenumber,
      postalcode: r.properties.postalcode,
      locality: r.properties.locality,
      coordinates: {
        lon: r.geometry.coordinates[0],
        lat: r.geometry.coordinates[1],
      },
    }))

    return wizardHelpers.jumpToStep(ctx, 'askIfCorrectSuggestedSender')
  })
)

const awaitManualRecipientInput = new Composer().on('text', (ctx) =>
  services.geolocation.get(ctx.update.message.text).then((res) => {
    if (!res || !res.length) {
      return wizardHelpers.jumpToStep(ctx, 'notifyNoGeolocationResult')
    }

    const { state } = ctx.scene.session

    state.suggestedRecipients = res.map((r) => ({
      name: r.properties.name,
      street: r.properties.street,
      housenumber: r.properties.housenumber,
      postalcode: r.properties.postalcode,
      locality: r.properties.locality,
      coordinates: {
        lon: r.geometry.coordinates[0],
        lat: r.geometry.coordinates[1],
      },
    }))

    return wizardHelpers.jumpToStep(ctx, 'askIfCorrectSuggestedRecipient')
  })
)

const awaitManualContactConfirmation = new Composer()
  .action('sender:geolookup:confirm', (ctx) => {
    const { state } = ctx.scene.session

    state.booking = Object.assign({}, state.booking, {
      id: services.booking.makeId(),
      from: Object.assign({}, state.booking.to, state.suggestedSenders[0]),
    })

    if (!state.booking.to) {
      return wizardHelpers.jumpToStep(ctx, 'askForManualRecipient')
    }

    return wizardHelpers.jumpToStep(ctx, 'askAddAdditionalInformation')
  })
  .action('sender:geolookup:decline', (ctx) => {
    const { state } = ctx.scene.session
    state.suggestedSenders = Array.from(state.suggestedSenders).slice(1)

    if (!state.suggestedSenders.length) {
      return wizardHelpers.jumpToStep(ctx, 'informNoSuggestedSenders')
    }

    return wizardHelpers.jumpToStep(ctx, 'askIfCorrectSuggestedSender')
  })
  .action('recipient:geolookup:confirm', (ctx) => {
    const { state } = ctx.scene.session

    state.booking = Object.assign({}, state.booking, {
      id: services.booking.makeId(),
      to: state.suggestedRecipients[0],
    })

    if (!state.booking.from) {
      return wizardHelpers.jumpToStep(ctx, 'askForSenderLocation')
    }

    return wizardHelpers.jumpToStep(ctx, 'askAddAdditionalInformation')
  })
  .action('recipient:geolookup:decline', (ctx) => {
    const { state } = ctx.scene.session
    state.suggestedRecipients = Array.from(state.suggestedRecipients).slice(1)

    if (!state.suggestedRecipients.length) {
      return wizardHelpers.jumpToStep(ctx, 'informNoSuggestedRecipients')
    }

    return wizardHelpers.jumpToStep(ctx, 'askIfCorrectSuggestedSender')
  })
  .action('recipient:geolookup:decline', (ctx) => {
    console.log('***declines recipient lookup suggestion***')
  })
  .action('sender:geolookup:decline', (ctx) => {
    console.log('***declines recipient lookup suggestion***')
  })

const awaitAdditionalInformationOrConfirm = new Composer()
  .action('booking:confirm', (ctx) => {
    ctx.scene.session.state = {}

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
    const [match] = state.matches

    state.booking = {
      from: {
        street: match.address?.street,
        housenumber: match.address.number,
        postalcode: match.address.zip,
        locality: match.locality,
      },
    }

    return wizardHelpers.jumpToStep(ctx, 'askForManualRecipient')
  })
  .action('freightslip:is_recipient', (ctx) => {
    const { state } = ctx.scene.session
    const [match] = state.matches

    state.booking = {
      to: {
        street: match.address.street,
        housenumber: match.address.number,
        postalcode: match.address.zip,
        locality: match.locality,
      },
    }

    return wizardHelpers.jumpToStep(ctx, 'askForSenderLocation')
  })

const awaitLocationAlternativeSelect = new Composer()
  .action('location:from_location', (ctx) =>
    wizardHelpers.jumpToStep(ctx, 'askForSenderLocationConfirm')
  )
  .action('location:from_manual', (ctx) =>
    wizardHelpers.jumpToStep(ctx, 'askForManualSender')
  )

const awaitSenderLocationConfirm = new Composer()
  .on('location', (ctx) =>
    services.geolocation.getReverse(ctx.message.location).then((res) => {
      if (!res || !res.length)
        return wizardHelpers.jumpToStep(ctx, 'notifyNoGeolocationResult')

      const { state } = ctx.scene.session

      state.suggestedSenders = res.map((r) => ({
        name: r.properties.name,
        street: r.properties.street,
        housenumber: r.properties.housenumber,
        postalcode: r.properties.postalcode,
        locality: r.properties.locality,
        coordinates: {
          lon: r.geometry.coordinates[0],
          lat: r.geometry.coordinates[1],
        },
      }))

      return wizardHelpers.jumpToStep(ctx, 'askIfCorrectSuggestedSender')
    })
  )
  .action('location:cancel', (ctx) =>
    wizardHelpers.jumpToStep(ctx, 'askForManualRecipient')
  )

const informNoSuggestedSenders = (ctx) => {
  ctx
    .reply('Det finns inga förslagna adresser.')
    .then(() => wizardHelpers.jumpToStep(ctx, 'askForSenderLocation'))
}
const informNoSuggestedRecipients = (ctx) => {
  ctx
    .reply('Det finns inga förslagna adresser.')
    .then(() => wizardHelpers.jumpToStep(ctx, 'askForManualRecipient'))
}

const askIfCorrectSuggestedSender = (ctx) => {
  const { state } = ctx.scene.session

  if (!state.suggestedSenders)
    return ctx.reply('Vi kunde inte hitta några föreslagna adresser :(')

  const [suggestion] = state.suggestedSenders

  return ctx
    .replyWithMarkdown(
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
    .then(() => ctx.wizard.next())
}

const askIfCorrectSuggestedRecipient = (ctx) => {
  const { state } = ctx.scene.session

  if (!state.suggestedRecipients)
    return ctx.reply('Vi kunde inte hitta några föreslagna adresser :(')

  const [suggestion] = state.suggestedRecipients

  return ctx
    .replyWithMarkdown(
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
    .then(() => ctx.wizard.next())
}

const notifyNoGeolocationResult = (ctx) =>
  ctx
    .reply(`Vi fick ingen träff på denna adress och detta namn...`)
    .then(() => wizardHelpers.jumpToStep(ctx, 'intro'))

const askForManualRecipient = (ctx) =>
  ctx.reply('Ange mottagaradressen').then(() => ctx.wizard.next())

const askForManualSender = (ctx) =>
  ctx.reply('Ange avsändaradressen').then(() => ctx.wizard.next())

const askAddAdditionalInformation = (ctx) => {
  const booking = ctx.scene.session.state.booking

  return ctx
    .replyWithMarkdown(
      `Då har du fått bokningsnummer:\n\n${ctx.scene.session.state.booking.id}\n\nAnteckna detta på försändelsen.`
        .concat(`\nSå här ser din bokning ut:`)
        .concat(`\n\nFrån:\n`)
        .concat(
          booking.from.street && booking.from.housenumber
            ? `${booking.from.street} ${booking.from.housenumber}`
            : booking.from.name
        )

        .concat(booking.from.postalcode ? `\n${booking.from.postalcode}` : '')
        .concat(booking.from.locality ? `\n${booking.from.locality}` : '')
        .concat(`\n\nTill:\n`)
        .concat(
          booking.to.street && booking.to.housenumber
            ? `${booking.to.street} ${booking.to.housenumber}`
            : booking.to.name
        )
        .concat(booking.to.postalcode ? `\n${booking.to.postalcode}` : '')
        .concat(booking.to.locality ? `\n${booking.to.locality}` : ''),
      Markup.inlineKeyboard([
        Markup.callbackButton('Fyll i fler detaljer', 'booking:add_extra'),
        Markup.callbackButton('Påbörja nästa', 'booking:confirm'),
      ]).extra()
    )
    .then(() => ctx.wizard.next())
}

const askForSenderLocation = (ctx) => {
  return ctx
    .replyWithMarkdown(
      `Hur vill du ange avsändaradressen?`,
      Markup.inlineKeyboard([
        Markup.callbackButton('Dela position', 'location:from_location'),
        Markup.callbackButton('Manuellt', 'location:from_manual'),
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
  askForSenderLocation,
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
  awaitManualContactConfirmation,
  askIfCorrectSuggestedSender,
  awaitManualContactConfirmation,
  informNoSuggestedSenders,
  askIfCorrectSuggestedRecipient,
  awaitManualContactConfirmation,
]
