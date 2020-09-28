// Create a bot that uses 'polling' to fetch new updates
const Telegraf = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)

module.exports = bot
