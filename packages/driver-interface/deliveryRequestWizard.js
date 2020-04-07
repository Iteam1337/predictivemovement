const Composer = require('telegraf/composer')
const WizardScene = require('telegraf/scenes/wizard')
const Markup = require('telegraf/markup')

module.exports = (callback) => {
  const stepHandler = new Composer()

  stepHandler.action('accept', (ctx) => {
    ctx.reply('Toppen, då hämtar du detta paketet')
    ctx.wizard.next()
    // return ctx.wizard.steps[ctx.wizard.cursor](ctx)
  })

  stepHandler.action('denial', (ctx) => {
    ctx.reply('Okej. Då letar vi vidare')
    ctx.wizard.next()
    // return ctx.wizard.steps[ctx.wizard.cursor](ctx)
  })

  return new WizardScene(
    'delivery-request',
    (ctx) => {
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

      return ctx.wizard.next()
      // return ctx.wizard.steps[ctx.wizard.cursor](ctx)
    },
    stepHandler,
    (ctx) => {
      callback(true)
      console.log('leaving scene')
      return ctx.scene.leave()
    }
  )
}
