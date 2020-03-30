const Composer = require('telegraf/composer')
const WizardScene = require('telegraf/scenes/wizard')
const Markup = require('telegraf/markup')

const init = bot => {
  const stepHandler = new Composer()

  stepHandler.action('accept', ctx => {
    ctx.reply('Toppen, då hämtar du detta paketet')
    return ctx.wizard.next()
  })

  stepHandler.action('denial', ctx => {
    ctx.reply('Okej. Då letar vi vidare')
    return ctx.wizard.next()
  })

  const bookingSuggestionWizard = new WizardScene(
    'booking-suggestion',
    ctx => {
      ctx.replyWithMarkdown(
        'Det finns en bokning i närheten, har du möjlighet att hämta denna?',
        Markdown.inlineKeyboard([
          Markdown.callbackButton('Godkänn', 'accept'),
          Markdown.callbackButton('Avbryt', 'denial'),
        ]).extra()
      )
      console.log('Inside wizard')
    },
    stepHandler,
    ctx => ctx.scene.leave()
  )

  const bookingsRequest = (msg, isAccepted) => {
    const exchange = 'bookings'
    return open
      .then(conn => conn.createChannel())
      .then(ch =>
        ch.assertExchange(exchange, 'headers', { durable: false }).then(() =>
          ch.publish(exchange, '', Buffer.from(JSON.stringify(msg)), {
            headers: { isAccepted },
          })
        )
      )
      .catch(console.warn)
  }
}

module.exports = { init }
