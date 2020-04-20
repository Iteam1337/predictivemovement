const registerHandlers = (bot) => {
  bot.command('testa', (ctx) => {
    console.log('hej')
    // ctx.scene.enter('delivery-request')
  })
}

module.exports = {
  registerHandlers,
}
