require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const bot = require('./adapters/bot')
const { bookingWizard } = require('./bookingWizard')
const botRoutes = require('./botRoutes')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const consumers = require('./consumers')
const messaging = require('./services/messaging')

bot.start(messaging.onBotStart)
bot.use(session())
consumers.register()

const stage = new Stage([bookingWizard])
bot.use(stage.middleware())

botRoutes.init(bot)
bot.launch()

const app = express()
  .use(cors())
  .use(bodyParser.json())
  .use(
    bodyParser.urlencoded({
      extended: true,
    })
  )

const server = require('http').Server(app)
const port = process.env.PORT || 8000
server.listen(port, console.log(`listening on ${port}`))
