const registerHandlers = (bot) => {
  bot.command('boka', (ctx) => {
    ctx.scene.enter('booking-wizard')
  })
}

module.exports = {
  registerHandlers,
}
