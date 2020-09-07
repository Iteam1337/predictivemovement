// Create a bot that uses 'polling' to fetch new updates
const Telegraf = require('telegraf')
const idMap = new Map()

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.context.metadata = {
  getId: (telegramId) => idMap.get(telegramId),
  setId: (telegramId, id) => idMap.set(telegramId, id),
}

module.exports = bot
