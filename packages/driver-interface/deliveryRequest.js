const bot = require('./bot')
const open = require('amqplib').connect('amqp://localhost')
const Markup = require('telegraf/markup')

const deliveryRequest = (chatId, msgOptions, { car, booking }) => {
  bot.telegram.sendMessage(
    chatId,
    `Ett paket finns att hämta på Munkebäcksgatan 33F som ska levereras till Storhöjdsgatan 9, har du möjlighet att hämta detta?`,
    {
      parse_mode: 'markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Ja',
              callback_data: JSON.stringify({
                a: true,
                id: msgOptions.correlationId,
                r: msgOptions.replyQueue,
              }),
            },
          ],
          [
            {
              text: 'Nej',
              callback_data: JSON.stringify({
                a: false,
                id: msgOptions.correlationId,
                r: msgOptions.replyQueue,
              }),
            },
          ],
        ],
      },
    }
  )
}

const onPickupConfirm = (msg) => {
  const chatId = msg.update.callback_query.from.id
  bot.telegram.sendMessage(
    chatId,
    `Härligt, nu kan du köra paketet till <insert en destination>`,
    {
      parse_mode: 'markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Levererat',
              callback_data: 'delivered',
            },
          ],
        ],
      },
    }
  )
}

const onPackageDelivered = () => {
  console.log('package has been delivered')
}

const pickupInstructions = () => {
  return open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue('pickupInstructions', {
          durable: false,
        })

        .then(
          () =>
            new Promise((resolve) => {
              ch.consume('pickupInstructions', (msg) => {
                const message = JSON.parse(msg.content.toString())
                ch.ack(msg)
                resolve(message)
              })
            })
        )
        .then((instructions) => {
          bot.telegram.sendMessage(
            instructions.id,
            `Bra du ska nu åka hit [Starta GPS](https://www.google.com/maps/dir/?api=1&&destination=${instructions.booking.departure.lat},${instructions.booking.departure.lon})`,
            {
              parse_mode: 'markdown',
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: 'Hämtat',
                      callback_data: 'confirm',
                    },
                  ],
                ],
              },
            }
          )
        })
    )
}

bot.on('callback_query', (msg) => {
  if (msg.update.callback_query.data === 'confirm') {
    return onPickupConfirm(msg)
  }

  try {
    const { a: isAccepted, ...options } = JSON.parse(
      msg.update.callback_query.data
    )

    if (options && options.r && options.id) {
      onDeliveryRequestResponse(isAccepted, options, msg)
    }
  } catch (error) {
    return
  }
})

const onDeliveryRequestResponse = (isAccepted, options, msg) => {
  msg.editMessageReplyMarkup()
  msg.answerCbQuery()
  msg.reply(isAccepted ? 'Kul!' : 'Tråkigt!')

  return open
    .then((conn) => conn.createChannel())
    .then((ch) => {
      ch.sendToQueue(options.r, Buffer.from(isAccepted.toString()), {
        correlationId: options.id,
      })
    })

    .catch(console.warn)
}

module.exports = {
  deliveryRequest,
  pickupInstructions,
}

// Pickup instructions example message
// { "id": "1124095220",
//   "booking":{
//      "departure": {"latitude": "57.00234", "longitude": "16.0134143" }}}

// Delivery RPC example message
// {
//   "car": {
//     "route": {
//       "weight_name": "routability",
//       "weight": 1561,
//       "started": "2020-04-07T13:09:42.334878",
//       "legs": [
//         null
//       ],
//       "geometry": [
//         null
//       ],
//       "duration": 1561,
//       "distance": 18171
//     },
//     "position": {
//       "lon": 11.801236,
//       "lat": 57.736512
//     },
//     "instructions": [
//       [
//         null
//       ],
//       [
//         null
//       ]
//     ],
//     "id": 1124095220,
//     "heading": {
//       "position": [
//         null
//       ],
//       "booking": [
//         null
//       ],
//       "action": "pickup"
//     },
//     "busy": false
//   },
//   "booking": {
//     "id": 493,
//     "destination": {
//       "lon": 16.143512,
//       "lat": 61.905908
//     },
//     "departure": {
//       "lon": 15.981676,
//       "lat": 61.847311
//     },
//     "bookingDate": "2020-04-07T13:09:15.732840Z"
//   }
// }
