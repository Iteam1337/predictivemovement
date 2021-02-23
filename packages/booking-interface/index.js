require('dotenv').config()

const bot = require('./adapters/bot')
const wizards = require('./wizards')
const botRoutes = require('./botRoutes')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const consumers = require('./consumers')
const messaging = require('./services/messaging')

bot.start(messaging.onBotStart)
bot.use(session())
consumers.register()

const stage = new Stage([...wizards])
bot.use(stage.middleware())

botRoutes.init(bot)

bot.launch()
