const { Markup } = require('telegraf')
const Composer = require('telegraf/composer')
const WizardScene = require('telegraf/scenes/wizard')
const bot = require('../adapters/bot')
const services = require('../services')
const utils = require('../utils')
const wizardHelpers = require('./helpers')

const awaitFreightSlipAnswer = new Composer()
  .action('freightslip:confirm', (ctx) =>
    wizardHelpers.jumpToStep(ctx, 'askForUpload')
  )
  .action('freightslip:decline', (ctx) => {
    console.log('hasFreightSlipDecline')
    // wizardHelpers.jumpToStep(ctx, 'askForRecipientInput')
  })

const awaitSenderOrRecipientConfirmation = new Composer()
  .action('freightslip:is_sender', (ctx) => {})
  .action('freightslip:is_recipient', (ctx) => {
    ctx.reply('Tack!')
    return wizardHelpers.jumpToStep(ctx, 'askForLocation')
  })

const askForLocation = (ctx) => {}

// const askForRecipientInput = (ctx) => {
//   ctx.reply('Skriv in mottagaradressen')
//   .then()
// }

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

const askForUpload = (ctx) =>
  ctx
    .reply(
      'Ta en bild på fraktsedeln eller addresslappen och skicka den till mig!'.concat(
        `\nFörsök ta bilden så nära det går och i så bra ljus som möjligt.`
      )
    )
    .then(() => ctx.wizard.next())

const handleImage = new Composer().on('photo', async (ctx) => {
  const photos = ctx.update.message.photo
  const [{ file_id }] = Array.from(photos).reverse()

  const fileLink = await services.bot.getFileLink(bot, file_id)

  // const photo = Buffer.from(response.data, 'binary').toString('base64')

  try {
    const text = await services.text.getTextFromPhoto(fileLink)

    if (text) {
      // const clean = text.replace(/[^\w\s.åäö:]/gim, ' ')
      // const matches = clean.match(
      //   /(?<address>(?<street>[A-Za-zåäöÅÄÖéÈ]+)\s+(?<nr>\d+\w*))?,?\s+?(?<countrycode>\w\w)?\s-?\s*(?<zipcode>\d+\s*\d+),?\s+(?<city>[A-Za-zåäöÅÄÖ]+),?\s?(?<country>[A-Za-zåäöÅÄÖ]+)?/gim
      // )

      ctx.wizard.state = { matches: await utils.scanAddress(text) }
      return wizardHelpers.jumpToStep(
        ctx,
        'askForSenderOrRecipientConfirmation'
      )
    }
  } catch (error) {
    console.warn('something went wrong: ', error)
  }
})

const askForSenderOrRecipientConfirmation = (ctx) => {
  const [match] = ctx.wizard.state.matches

  if (!match) return // enter manually or something
  console.log(match)

  return ctx
    .replyWithMarkdown(
      `${match.name}`
        .concat(`\n${match.address}`)
        .concat(`\n${match.postCode}`)
        .concat(`\n${match.city}`),
      Markup.inlineKeyboard([
        Markup.callbackButton('Mottagare', 'freightslip:is_sender'),
        Markup.callbackButton('Avsändare', 'freightslip:is_recipient'),
      ]).extra()
    )
    .then(() => ctx.wizard.next())
}

//

// const askLocationRequest = (ctx) =>
//   ctx
//     .reply('Vill du även dela din position?', {
//       reply_markup: Markup.inlineKeyboard([
//         Markup.callbackButton('Ja', messages.LOCATION_REQUEST_GRANTED),
//         Markup.callbackButton('NEJ', messages.LOCATION_REQUEST_DENIED),
//       ]).oneTime(),
//       // reply_markup: Markup.keyboard([
//       //   Markup.locationRequestButton('📍 Dela position'),
//       // ]).oneTime(),
//     })
//     .then(() => ctx.wizard.next())

const freightslip = new WizardScene(
  'freightslip',
  intro,
  awaitFreightSlipAnswer,
  askForUpload,
  handleImage,
  askForSenderOrRecipientConfirmation,
  awaitSenderOrRecipientConfirmation,
  askForLocation
)

module.exports = freightslip
