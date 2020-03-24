const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const bot = require('./bot')
const driver = require('./driver')
const booking = require('./booking')
const open = require('./amqp')

const SUGGESTED_BOOKING_QUEUE = 'suggested_booking'

bot.start(ctx => {
  const user = ctx.update.message.from

  ctx.reply(
    `Welcome ${user.first_name} ${user.last_name}. Press the "share" button to the left of the message input field to share your location! :)`
  )
})

booking.init(bot)
driver.init(bot)

bot.launch()

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

// open
//   .then(conn => conn.createChannel())
//   .then(ch =>
//     ch.assertQueue(SUGGESTED_BOOKING_QUEUE).then(ok =>
//       ch.consume(SUGGESTED_BOOKING_QUEUE, msg => {
//         if (msg === null) return

//         const parsedMessage = JSON.parse(Buffer.from(msg.content))
//         // const depart
//         bot.telegram.sendMessage(
//           parsedMessage.chatId,
//           `*Du har fått ett bokningsförslag*

// *Från*: ${parsedMessage.departure.address}
// *Till*: ${parsedMessage.destination.address}

// [Öppna med Google Maps](https://www.google.com/maps/dir/?api=1&origin=${parsedMessage.departure.lat},${parsedMessage.departure.lon}&destination=${parsedMessage.destination.lat},${parsedMessage.destination.lon})`,
//           {
//             parse_mode: 'markdown',
//             reply_markup: {
//               inline_keyboard: [
//                 [
//                   {
//                     text: 'Godkänn',
//                     callback_data: 'accept',
//                   },
//                 ],
//                 [
//                   {
//                     text: 'Avvisa',
//                     callback_data: 'denial',
//                   },
//                 ],
//               ],
//             },
//           }
//         )

//         ch.ack(msg)
//       })
//     )
//   )
//   .catch(console.warn)

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
