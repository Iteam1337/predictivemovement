const init = (bot) => {
  bot.command('boka', (ctx) => {
    ctx.scene.enter('booking-wizard')
  })
}

module.exports = {
  init,
}
