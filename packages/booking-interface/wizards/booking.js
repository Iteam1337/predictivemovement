const Composer = require('telegraf/composer')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')
const { v4: uuidv4 } = require('uuid') // https://www.npmjs.com/package/id62
const { createBooking } = require('../services/amqp')

const stepHandler = new Composer()

stepHandler.action('confirm', (ctx) => {
  const senderId = ctx.update.callback_query.from.id
  const metadata = {
    telegram: {
      senderId,
    },
  }
  ctx.reply('Perfekt! Din bokning är registrerad')
  const booking = {
    id: uuidv4(),
    metadata,
    bookingDate: new Date().toISOString(),
    pickup: {
      lon: ctx.wizard.state.data.from.lon,
      lat: ctx.wizard.state.data.from.lat,
    },
    delivery: {
      lon: ctx.wizard.state.data.to.lon,
      lat: ctx.wizard.state.data.to.lat,
    },
  }

  createBooking(booking)
  ctx.wizard.next()
  ctx.wizard.steps[ctx.wizard.cursor](ctx)
})

stepHandler.action('cancel', (ctx) => {
  ctx.reply('Din bokning är avbruten')
  ctx.wizard.next()
  ctx.wizard.steps[ctx.wizard.cursor](ctx)
})

const bookingWizard = new WizardScene(
  'booking',
  (ctx) => {
    ctx.reply(
      'Hej! Var ska paketet hämtas? (Klicka på "gemet" nere till vänster om textfältet och välj "location", för att välja position)'
    )
    ctx.wizard.state.data = {}
    return ctx.wizard.next()
  },
  (ctx) => {
    if (!ctx.message.location) {
      return ctx.reply('Du måste välja på kartan juh')
    }

    ctx.wizard.state.data.from = {
      lat: ctx.message.location.latitude,
      lon: ctx.message.location.longitude,
    }

    ctx.reply('Härligt! Nu är det bara att välja destination')
    return ctx.wizard.next()
  },
  (ctx) => {
    if (!ctx.message || !ctx.message.location) {
      return ctx.reply('Du måste välja på kartan juh')
    }

    ctx.wizard.state.data.to = {
      lat: ctx.message.location.latitude,
      lon: ctx.message.location.longitude,
    }

    ctx.replyWithMarkdown(
      `[Visa på kartan!](https://www.google.com/maps/dir/?api=1&origin=${ctx.wizard.state.data.from.lat},${ctx.wizard.state.data.from.lon}&destination=${ctx.wizard.state.data.to.lat},${ctx.wizard.state.data.to.lon})`
    )

    ctx.replyWithMarkdown(
      `Bekräfta din boking genom att klicka på någon av följande:`,
      Markup.inlineKeyboard([
        Markup.callbackButton('Avbryt', 'cancel'),
        Markup.callbackButton('Godkänn', 'confirm'),
      ]).extra()
    )

    return ctx.wizard.next()
  },
  stepHandler,
  (ctx) => ctx.scene.leave()
)

module.exports = bookingWizard
