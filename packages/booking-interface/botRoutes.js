const services = require('./services')

const init = (bot) => {
  bot.command('start', (ctx) =>
    services.messaging
      .onBotStart(ctx)
      .then(() => ctx.scene.enter('freightslip'))
  )
  bot.command('login', (ctx) => ctx.scene.enter('login'))
  bot.action('login', (ctx) => ctx.scene.enter('login'))
}

module.exports = {
  init,
}
