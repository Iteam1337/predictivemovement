// Create a bot that uses 'polling' to fetch new updates
const Telegraf = require('telegraf')
const idMap = new Map()

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.context.metadata = {
  getVehicleIdFromTelegramId: (telegramId) => idMap.get(telegramId),
  setVehicleIdFromTelegramId: (telegramId, id) => idMap.set(telegramId, id),
}

module.exports = bot
