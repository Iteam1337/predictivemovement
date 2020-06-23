const bot = require('../adapters/bot')
const Markup = require('telegraf/markup')
const { open } = require('../adapters/amqp')
const moment = require('moment')

const replyQueues = new Map()

const onBotStart = (ctx) => {
  const {
    first_name,

    last_name,

    id,
  } = ctx.update.message.from

  ctx.reply(
    `Välkommen ${first_name} ${last_name}! Klicka på "gemet" nere till vänster om textfältet och välj "location", sedan "live location" för att dela din position. :) Ditt id är ${id}`
  )
}

const sendPickupOffer = (
  chatId,
  msgOptions,
  { startingAddress, route, activities, bookingIds }
) => {
  replyQueues.set(msgOptions.correlationId, msgOptions.replyQueue)

  const directions = activities.reduce((result, { address }) => {
    return result.concat(`/${address.lat}, ${address.lon}`)
  }, 'https://www.google.com/maps/dir')

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

const sendPickupInstructions = (message) => {
  return bot.telegram.sendMessage(
    message.assigned_to.metadata.telegram.senderId,
    `Hämta paketet [här](https://www.google.com/maps/dir/?api=1&&destination=${message.pickup.lat},${message.pickup.lon})!`,
    {
      parse_mode: 'markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Hämtat',
              callback_data: JSON.stringify({
                e: 'pickup',
                id: message.id,
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
  onBotStart,
  sendPickupOffer,
  sendPickupInstructions,
  onPickupConfirm,
  onPickupOfferResponse,
}
