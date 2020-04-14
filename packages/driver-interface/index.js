require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const bot = require('./bot')
const driver = require('./driver')
// const deliveryRequest = require('./deliveryRequestWizard')
const botCommands = require('./botCommands')
const session = require('telegraf/session')
const amqp = require('./amqp')
const Stage = require('telegraf/stage')

const { pickupInstructions } = require('./deliveryRequest')

bot.start((ctx) => {
  const {
    first_name,

    last_name,

    id,
  } = ctx.update.message.from

  ctx.reply(
    `Välkommen ${first_name} ${last_name}! Klicka på "gemet" nere till vänster om textfältet och välj "location", sedan "live location" för att dela din position. :) Ditt id är ${id}`
  )
})

bot.use(session())

botCommands.registerHandlers(bot)

amqp.open.then(() => {
  pickupInstructions()
  amqp.rpcServer()
})

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
