// Create a bot that uses 'polling' to fetch new updates
import Telegraf from 'telegraf'

const bot = new Telegraf(process.env.BOT_TOKEN)

export default bot
