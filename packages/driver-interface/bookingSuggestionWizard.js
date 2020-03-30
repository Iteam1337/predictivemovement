const Composer = require('telegraf/composer')
const WizardScene = require('telegraf/scenes/wizard')

const init = bot => {
  const stepHandler = new Composer()
  stepHandler.action('accept', ctx => {
    ctx.reply('Toppen, då hämtar du detta paketet')
  })
  stepHandler.action('denial', ctx => {
    ctx.reply('Okej. Du är inte ansvarig för att hämta upp paketet')
  })

  const bookingSuggestionWizard = new WizardScene('booking-suggestion', ctx => {
    console.log('Inside wizard')
  })

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

  bot.action('accept', (ctx, next) => {
    console.log('ctx from accept', ctx)
    return bookingsRequest(ctx, true).then(() =>
      ctx.reply('bokningen är din!').then(() => next())
    )
  })

  bot.action('denial', (ctx, next) => {
    return bookingsRequest(ctx, false).then(() =>
      ctx.reply('Okej! Vi letar vidare :)').then(() => next())
    )
  })
}
