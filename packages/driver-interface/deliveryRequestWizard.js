const amqp = require('./amqp')
const Composer = require('telegraf/composer')
const WizardScene = require('telegraf/scenes/wizard')
const Markup = require('telegraf/markup')

const stepHandler = new Composer()

stepHandler.action('accept', ctx => {
  amqp.deliveryRequest(ctx.update.callback_query.from.id, true).then(() => {
    ctx.reply('Toppen, då hämtar du detta paketet')
    ctx.wizard.next()
  })
})

stepHandler.action('denial', ctx => {
  ctx.reply('Okej. Då letar vi vidare')
  amqp.deliveryRequest(ctx.update.callback_query.from.id, false)
  ctx.wizard.next()
})

const deliveryRequestWizard = new WizardScene(
  'delivery-request',
  ctx => {
    console.log('Inside wizard')
    ctx.reply(
      'Ett paket finns att hämta på Munkebäcksgatan 33F som ska levereras till Storhöjdsgatan 9'
    )
    ctx.replyWithMarkdown(
      'Har du möjlighet att hämta detta?',
      Markup.inlineKeyboard([
        Markup.callbackButton('Ja', 'accept'),
        Markup.callbackButton('Nej', 'denial'),
      ]).extra()
    )

    ctx.wizard.next()
  },
  stepHandler,
  ctx => {
    console.log('leaving scene')
    return ctx.scene.leave()
  }
)

module.exports = { deliveryRequestWizard }
