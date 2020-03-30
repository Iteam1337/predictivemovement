const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const bot = require('./bot')
const driver = require('./driver')
const bookingWizard = require('./bookingWizard')

bot.start(ctx => {
  const { first_name, last_name, id } = ctx.update.message.from

  ctx.reply(
    `Welcome ${first_name} ${last_name}. Press the "share" button to the left of the message input field to share your location! :)`
  )
})

bookingWizard.init(bot)

bot.command('newbooking', ctx => {
  ctx.scene.enter('booking-wizard')
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
const port = process.env.PORT || 3000
server.listen(port, console.log(`listening on ${port}`))
