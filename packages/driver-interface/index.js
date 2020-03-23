const express = require('express')

const bodyParser = require('body-parser')
const cors = require('cors')

var open = require('amqplib').connect('amqp://localhost')
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
  const msg = ctx.message
  onMessage(msg)
})

bot.on('edited_message', ctx => {
  const msg = ctx.update.edited_message
  onMessage(msg)
})

const onMessage = msg => {
  if (!msg.location) return

  const position = {
    lon: msg.location.longitude,
    lat: msg.location.latitude,
  }

  const username = msg.from.username
  const message = {
    username,
    id: msg.from.id,
    chatId: msg.chat.id,
    position,
    date: Date(msg.edit_date),
  }

  updateLocation(message)
}

const updateLocation = msg => {
  // Publisher
  open
    .then(conn => conn.createChannel())
    .then(ch =>
      ch
        .assertExchange('cars', 'fanout', { durable: false })
        .then(() => ch.publish('cars', '', Buffer.from(JSON.stringify(msg))))
    )
    .catch(console.warn)
}

/**
 * Message structure
 * {
  "chatId": 1124095220,
  "departure": {
    "address": "någon adress",
    "lat": 57.7009147,
    "lon": 11.7537563
  },
  "destination": {
    "address":"någon annan adress",
    "lat": 58.4002622,
    "lon": 13.8248683
  }
}
 */

open
  .then(conn => conn.createChannel())
  .then(ch =>
    ch.assertQueue(SUGGESTED_BOOKING_QUEUE).then(ok =>
      ch.consume(SUGGESTED_BOOKING_QUEUE, msg => {
        if (msg === null) return

        const parsedMessage = JSON.parse(Buffer.from(msg.content))
        // const depart
        bot.telegram.sendMessage(
          parsedMessage.chatId,
          `*Du har fått ett bokningsförslag*

*Från*: ${parsedMessage.departure.address}
*Till*: ${parsedMessage.destination.address}

[Öppna med Google Maps](https://www.google.com/maps/dir/?api=1&origin=${parsedMessage.departure.lat},${parsedMessage.departure.lon}&destination=${parsedMessage.destination.lat},${parsedMessage.destination.lon})`,
          {
            parse_mode: 'markdown',
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
      })
    )
  )
  .catch(console.warn)

const bookingsRequest = (msg, isAccepted) => {
  const exchange = 'bookings'
  return open
    .then(conn => conn.createChannel())
    .then(ch =>
      ch.assertExchange(exchange, 'headers', { durable: false }).then(() =>
        ch.publish(exchange, '', Buffer.from(JSON.stringify(msg)), {
          headers: { isAccepted },
        })
      )
    )
    .catch(console.warn)
}

bot.action('accept', (ctx, next) => {
  console.log('ctx from accept', ctx)
  return bookingsRequest(ctx, true).then(() =>
    ctx.reply('bokningen är din!').then(() => next())
  )
})

bot.action('denial', (ctx, next) => {
  return bookingsRequest(ctx, false).then(() =>
    ctx.reply('Okej! Vi letar vidare :)').then(() => next())
  )
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
