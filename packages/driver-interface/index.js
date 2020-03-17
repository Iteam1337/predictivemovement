const express = require('express')

const bodyParser = require('body-parser')
const cors = require('cors')

var open = require('amqplib').connect('amqp://localhost')
const CLIENT_LOCATION_QUEUE = 'client_location'
const SUGGESTED_BOOKING_QUEUE = 'suggested_booking'

// replace the value below with the Telegram token you receive from @BotFather

// Create a bot that uses 'polling' to fetch new updates
const Telegraf = require('telegraf')

const token = '1077243191:AAEOShTP8DbrV3krz6MRP2rp8DlAamr2Trk'
const bot = new Telegraf(token)

bot.start(ctx => {
  const user = ctx.update.message.from

  ctx.reply(
    `Welcome ${user.first_name} ${user.last_name}. Press the "share" button to the left of the message input field to share your location! :)`
  )
})

bot.help(ctx => ctx.reply('Send me a sticker'))

bot.on('message', ctx => {
  if (!ctx.message.location) return

  const location = {
    lon: ctx.message.location.longitude,
    lat: ctx.message.location.latitude,
  }

  const username = ctx.message.from.username
  const msg = {
    username,
    id: ctx.message.from.id,
    chatId: ctx.message.chat.id,
    location,
    date: Date(ctx.message.date),
  }

  updateLocation(msg)
})

bot.on('edited_message', ctx => {
  const msg = ctx.update.edited_message

  if (!msg.location) return

  const location = {
    lon: msg.location.longitude,
    lat: msg.location.latitude,
  }

  const username = msg.from.username
  const message = {
    username,
    id: msg.from.id,
    chatId: msg.chat.id,
    location,
    date: Date(msg.edit_date),
  }

  updateLocation(message)
})

const updateLocation = msg => {
  // Publisher
  open
    .then(conn => conn.createChannel())
    .then(ch =>
      ch
        .assertQueue(CLIENT_LOCATION_QUEUE)
        .then(ok =>
          ch.sendToQueue(
            CLIENT_LOCATION_QUEUE,
            Buffer.from(JSON.stringify(msg))
          )
        )
    )
    .catch(console.warn)
}

open
  .then(conn => conn.createChannel())
  .then(ch =>
    ch.assertQueue(SUGGESTED_BOOKING_QUEUE).then(ok =>
      ch.consume(SUGGESTED_BOOKING_QUEUE, msg => {
        if (msg !== null) {
          const parsedMessage = JSON.parse(msg.content.toString())

          bot.telegram.sendMessage(
            parsedMessage.chatId,
            'Du har fått ett bokningsförslag',
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: 'Godkänn',
                      callback_data: 'accept',
                    },
                  ],
                  [
                    {
                      text: 'Avvisa',
                      callback_data: 'denial',
                    },
                  ],
                ],
              },
            }
          )

          ch.ack(msg)
        }
      })
    )
  )
  .catch(console.warn)

bot.action('accept', (ctx, next) => {
  console.log('ctx from accept', ctx)
  return ctx.reply('bokningen är din!').then(() => next())
})

bot.action('denial', (ctx, next) => {
  return ctx.reply('Okej! Vi letar vidare :)').then(() => next())
})

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
