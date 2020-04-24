const Composer = require('telegraf/composer')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')
const { v4: uuidv4 } = require('uuid') // https://www.npmjs.com/package/id62
const { createBooking } = require('./services/amqp')

const stepHandler = new Composer()

stepHandler.action('confirm', (ctx) => {
  ctx.reply('Perfekt, din bokning är inlagd')
  const booking = {
    id: uuidv4(),
    bookingDate: new Date().toISOString(),
    departure: {
      lon: ctx.wizard.state.data.from.lon,
      lat: ctx.wizard.state.data.from.lat,
    },
    destination: {
      lon: ctx.wizard.state.data.to.lon,
      lat: ctx.wizard.state.data.to.lat,
    },
  }

  createBooking(booking)
  return ctx.wizard.next()
})

stepHandler.action('cancel', (ctx) => {
  ctx.reply('Din bokning är avbruten')
  return ctx.wizard.next()
})

const bookingWizard = new WizardScene(
  'booking-wizard',
  (ctx) => {
    ctx.reply('Hej! Vart ska paketet hämtas ifrån? (välj plats med gemet)')
    ctx.wizard.state.data = {}
    return ctx.wizard.next()
  },
  (ctx) => {
    if (!ctx.message.location) {
      return ctx.reply('Du måste välja på karta juh')
    }

    ctx.wizard.state.data.from = {
      lat: ctx.message.location.latitude,
      lon: ctx.message.location.longitude,
    }

    ctx.reply('Härligt, nu är det bara att välja destination')
    return ctx.wizard.next()
  },
  (ctx) => {
    if (!ctx.message || !ctx.message.location) {
      return ctx.reply('Du måste välja på karta juh')
    }

    ctx.wizard.state.data.to = {
      lat: ctx.message.location.latitude,
      lon: ctx.message.location.longitude,
    }

    ctx.replyWithMarkdown(
      `[Se på kartan!](https://www.google.com/maps/dir/?api=1&origin=${ctx.wizard.state.data.from.lat},${ctx.wizard.state.data.from.lon}&destination=${ctx.wizard.state.data.to.lat},${ctx.wizard.state.data.to.lon})`
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
  (ctx) => {
    console.log('leaving booking request scene')
    return ctx.scene.leave()
  }
)

module.exports = { bookingWizard }
