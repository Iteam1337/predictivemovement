const Telegraf = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)

module.exports = bot
