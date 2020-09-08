const bot = require('../adapters/bot')
const Markup = require('telegraf/markup')
const { open } = require('../adapters/amqp')
const moment = require('moment')
const { getDirectionsFromActivities } = require('./google')
const replyQueues = new Map()

const onBotStart = (ctx) => {
  ctx.reply(
    "Välkommen till Predictive Movement. När du loggat in kan du agera som förare och hämta och leverera paket i vårt system. Logga in genom att skriva '/login'."
  )
}

const sendPickupOffer = (
  chatId,
  msgOptions,
  { startingAddress, route, activities, bookingIds }
) => {
  replyQueues.set(msgOptions.correlationId, msgOptions.replyQueue)

  const directions = getDirectionsFromActivities(activities)

  const message = `${
    bookingIds.length
  } paket finns att hämta. Rutten börjar på ${startingAddress}. Turen beräknas att ta cirka ${moment
    .duration({ seconds: route.duration })
    .humanize()}. Vill du ha denna order?
  [Se på kartan](${directions})`

  bot.telegram.sendMessage(parseInt(chatId, 10), message, {
    parse_mode: 'markdown',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Nej',
            callback_data: JSON.stringify({
              a: false,
              id: msgOptions.correlationId,
              e: 'offer',
            }),
          },
          {
            text: 'Ja',
            callback_data: JSON.stringify({
              a: true,
              id: msgOptions.correlationId,
              e: 'offer',
            }),
          },
        ],
      ],
    },
  })
}

const onPickupConfirm = (ctx) => {
  const { id } = JSON.parse(ctx.update.callback_query.data)

  return ctx.replyWithMarkdown(
    'Härligt, nu kan du köra paketet till dess destination!',
    Markup.inlineKeyboard([
      Markup.callbackButton(
        'Levererat',
        JSON.stringify({ e: 'delivered', id })
      ),
    ]).extra()
  )
}

const onPickupOfferResponse = (isAccepted, options, msg) => {
  msg.editMessageReplyMarkup()
  msg.answerCbQuery()
  msg.reply(isAccepted ? 'Kul!' : 'Tråkigt, kanske nästa gång!')

  const replyQueue = replyQueues.get(options.id)

  if (!replyQueue)
    return Promise.reject(`missing reply queue for ${options.id}`)

  return open
    .then((conn) => conn.createChannel())
    .then((ch) => {
      ch.sendToQueue(replyQueue, Buffer.from(isAccepted.toString()), {
        correlationId: options.id,
      })
    })
    .catch(console.warn)
}

const onNoInstructionsForVehicle = (ctx) =>
  ctx.reply('Vi kunde inte hitta några instruktioner...')

const onInstructionsForVehicle = (activities, bookingIds, id) => {
  const directions = getDirectionsFromActivities(activities)

  return bot.telegram.sendMessage(
    id,
    `${bookingIds.length} paket finns att hämta.[Se på kartan](${directions}).`,
    { parse_mode: 'markdown' }
  )
}

const sendDeliveryInstruction = (instruction, telegramId) => {
  //  Om du får problem så är kontaktuppgiften: 070-1234567 [Länk till telefonappen]
  //Tryck på [Levererat] när du har lämnat paketet.
  console.log(instruction)
  return bot.text.sendMessage(
    telegramId,
    `Leverera paket "${instruction.id}" [här](https://www.google.com/maps/dir/?api=1&&destination=${instruction.address.lat},${instruction.address.lon})!
    Tryck [Levererat] när du har lämnat paketet.
    Ring kontaktpersonen
    `,
    {
      parse_mode: 'markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Levererat',
              callback_data: JSON.stringify({
                e: 'delivered',
                id: instruction.id,
              }),
            },
          ],
        ],
      },
    }
  )
}

const sendPickupInstruction = (instruction, telegramId) => {
  // 🎁 Hämta paket “pmb-aabbcc” på Östermalmsgatan 26A
  // [Länk till Google Maps]

  // Tryck [Hämtat] när du hämtat upp paketet
  return bot.telegram.sendMessage(
    telegramId,
    `🎁 Hämta paket "${instruction.id}" [här](https://www.google.com/maps/dir/?api=1&&destination=${instruction.address.lat},${instruction.address.lon})!
    Tryck [Hämtat] när du hämtat upp paketet.`,
    {
      parse_mode: 'markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Hämtat',
              callback_data: JSON.stringify({
                e: 'picked_up',
                id: instruction.id,
              }),
            },
          ],
        ],
      },
    }
  )
}

module.exports = {
  onNoInstructionsForVehicle,
  onInstructionsForVehicle,
  onBotStart,
  sendPickupOffer,
  sendPickupInstruction,
  sendDeliveryInstruction,
  onPickupConfirm,
  onPickupOfferResponse,
}
