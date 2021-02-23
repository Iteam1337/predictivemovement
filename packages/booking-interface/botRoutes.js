const init = (bot) => {
  bot.command('login', (ctx) => ctx.scene.enter('login'))
  bot.action('login', (ctx) => ctx.scene.enter('login'))
}

module.exports = {
  init,
}
