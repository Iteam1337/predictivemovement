const registerHandlers = bot => {
  bot.command('boka', ctx => {
    ctx.scene.enter('booking-wizard')
  })

  bot.command('testa', ctx => {
    ctx.scene.enter('delivery-request')
  })
}

module.exports = { registerHandlers }
