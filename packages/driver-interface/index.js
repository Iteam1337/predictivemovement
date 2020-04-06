const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const bot = require('./bot')
const driver = require('./driver')
const { bookingWizard } = require('./bookingWizard')
const { deliveryRequestWizard } = require('./deliveryRequestWizard')
const botCommands = require('./botCommands')
const session = require('telegraf/session')
const amqp = require('./amqp')
const Stage = require('telegraf/stage')

bot.start(ctx => {
  const { first_name, last_name } = ctx.update.message.from

  ctx.reply(
    `Välkommen ${first_name} ${last_name}! Klicka på "gemet" nere till vänster om textfältet och välj "location", sedan "live location" för att dela din position. :)`
  )
})

bot.use(session())
const stage = new Stage([deliveryRequestWizard, bookingWizard])
bot.use(stage.middleware())

botCommands.registerHandlers(bot)

amqp
  .init()
  .then(() => amqp.subscribe(amqp.queues.DELIVERY_REQUESTS, console.log))

driver.init(bot)

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
const port = process.env.PORT || 5000
server.listen(port, console.log(`listening on ${port}`))
