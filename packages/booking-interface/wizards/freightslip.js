const { Markup } = require('telegraf')
const Composer = require('telegraf/composer')
const WizardScene = require('telegraf/scenes/wizard')
const bot = require('../adapters/bot')
const axios = require('axios')
const services = require('../services')

const messages = {
  LOCATION_REQUEST_DENIED: 'location_request_denied',
  LOCATION_REQUEST_GRANTED: 'location_request_granted',
}

const forceNext = (ctx) => {
  ctx.wizard.next()
  ctx.wizard.steps[ctx.wizard.cursor](ctx)
}

const intro = (ctx) =>
  ctx
    .reply(
      'Ta en bild på fraktsedeln eller addresslappen och skicka den till mig!'.concat(
        `\nFörsök ta bilden så nära det går och i så bra ljus som möjligt.`
      )
    )
    .then(() => ctx.wizard.next())

const handleImage = new Composer()

  .on('photo', async (ctx) => {
    const photos = ctx.update.message.photo
    const [{ file_id }] = Array.from(photos).reverse()

    const fileLink = await bot.telegram.getFileLink(file_id)
    const response = await axios.get(fileLink, {
      responseType: 'arraybuffer',
    })

    const photo = Buffer.from(response.data, 'binary').toString('base64')

    const { data } = await axios.get(
      `http://localhost:4000/gettext?url=${fileLink}`
    )
    const clean = data.text.replace(/[^\w\s.åäö:]/gim, ' ')
    console.log('this is clean: ', clean)

    // .post('http://localhost:4000/gettext', { image: photo })
    const result = await axios.get(
      `http://localhost:3000/getAddressFromText?text=${encodeURIComponent(
        clean
      )}`
    )

    console.log('this is res: ', result)

    return services.amqp
      .publishFreightslipPhoto(photo)
      .then(() =>
        ctx.reply('Tack! Bilden har tagits emot och skickats till plattformen.')
      )
  })
  .on('file', (ctx) => console.log('this is file: ', ctx))
// .on('message', (ctx) =>
//   ctx.reply(
//     'Jag förstår inte ditt meddelande. Till mig kan du bara skicka bilder! :)'
//   )
// )

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

const freightslip = new WizardScene('freightslip', intro, handleImage)

module.exports = freightslip
