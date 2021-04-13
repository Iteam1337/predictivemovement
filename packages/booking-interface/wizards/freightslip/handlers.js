const Composer = require('telegraf/composer')
const bot = require('../../adapters/bot')
const services = require('../../services')
const utils = require('../../utils')
const wizardHelpers = require('../helpers')
const messaging = require('./messaging')

const awaitManualSenderInput = new Composer().on('text', (ctx) =>
  services.geolocation.get(ctx.update.message.text).then((res) => {
    if (!res || !res.length) {
      return wizardHelpers.jumpToStep(ctx, 'notifyNoGeolocationResult')
    }

    const { state } = ctx.scene.session
    state.suggestedSenders = res.map(utils.peliasResToSuggestedRecipient)

    return wizardHelpers.jumpToStep(ctx, 'askIfCorrectSuggestedSender')
  })
)

const awaitManualRecipientInput = new Composer().on('text', (ctx) =>
  services.geolocation.get(ctx.update.message.text).then((res) => {
    if (!res || !res.length) {
      return wizardHelpers.jumpToStep(ctx, 'notifyNoGeolocationResult')
    }

    const { state } = ctx.scene.session
    state.suggestedRecipients = res.map(utils.peliasResToSuggestedRecipient)

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

    return wizardHelpers.jumpToStep(ctx, 'greet')
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
      state.suggestedSenders = res.map(utils.peliasResToSuggestedRecipient)

      return wizardHelpers.jumpToStep(ctx, 'askIfCorrectSuggestedSender')
    })
  )
  .action('location:cancel', (ctx) =>
    wizardHelpers.jumpToStep(ctx, 'askForManualRecipient')
  )

const informNoSuggestedSenders = (ctx) =>
  messaging
    .informNoSuggestedSenders(ctx)
    .then(() => wizardHelpers.jumpToStep(ctx, 'askForSenderLocation'))

const informNoSuggestedRecipients = (ctx) =>
  messaging
    .informNoSuggestedRecipients(ctx)
    .then(() => wizardHelpers.jumpToStep(ctx, 'askForManualRecipient'))

const askIfCorrectSuggestedSender = (ctx) =>
  messaging.askIfCorrectSuggestedSender(ctx).then(() => ctx.wizard.next())

const askIfCorrectSuggestedRecipient = (ctx) => {
  const { state } = ctx.scene.session

  if (!state.suggestedRecipients)
    return ctx.reply('Vi kunde inte hitta några föreslagna adresser :(')

  return messaging
    .askIfCorrectSuggestedRecipient(ctx)
    .then(() => ctx.wizard.next())
}

const notifyNoGeolocationResult = (ctx) =>
  messaging
    .notifyNoGeolocationResult(ctx)
    .then(() => wizardHelpers.jumpToStep(ctx, 'greet'))

const askForManualRecipient = (ctx) =>
  messaging.askForManualRecipient(ctx).then(() => ctx.wizard.next())

const askForManualSender = (ctx) =>
  messaging.askForManualSender(ctx).then(() => ctx.wizard.next())

const askAddAdditionalInformation = (ctx) =>
  messaging
    .askAddAdditionalInformation(ctx, ctx.scene.session.state.booking)
    .then(() => ctx.wizard.next())

const askForSenderLocation = (ctx) =>
  messaging.askForSenderLocation(ctx).then(() => ctx.wizard.next())

const greet = (ctx) => messaging.greet(ctx).then(() => ctx.wizard.next())

const askForUpload = (ctx) =>
  messaging.askForUpload(ctx).then(() => ctx.wizard.next())

const awaitImageUpload = new Composer().on('photo', async (ctx) => {
  const photos = ctx.update.message.photo
  const [{ file_id }] = Array.from(photos).reverse()

  const fileLink = await services.bot.getFileLink(bot, file_id)

  try {
    const text = await services.text.getTextFromImage(fileLink)

    if (!text) {
      return wizardHelpers.jumpToStep(ctx, 'noParseTextFromImageResult')
    }

    const regexResult = utils.formatRegexResult(
      Array.from(text.matchAll(utils.adress))
    )

    const elasticRes = await Promise.all(regexResult.map(services.elastic.get))
    const searchResults = elasticRes.map((res) =>
      services.formatQueryResult(res.body)
    )

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

const noParseTextFromImageResult = (ctx) =>
  messaging.noParseTextFromImageResult(ctx).then(() => ctx.wizard.next())

const askForSenderOrRecipientConfirmation = (ctx) =>
  messaging
    .askForSenderOrRecipientConfirmation(ctx)
    .then(() => ctx.wizard.next())

const askForSenderLocationConfirm = (ctx) =>
  messaging.askForSenderLocationConfirm(ctx).then(() => ctx.wizard.next())

module.exports = [
  greet,
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
  informNoSuggestedRecipients,
]
