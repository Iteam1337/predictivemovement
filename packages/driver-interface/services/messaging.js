const bot = require('../adapters/bot')
const Markup = require('telegraf/markup')
const { open } = require('../adapters/amqp')

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
  { pickupAddress, deliveryAddress, booking }
) => {

  replyQueues.set(msgOptions.correlationId, msgOptions.replyQueue)
  

  bot.telegram.sendMessage(
    parseInt(chatId, 10),
    `Ett paket finns att hämta på ${pickupAddress}. Det ska levereras till ${deliveryAddress}. Har du möjlighet att hämta detta?
    [Se på kartan](https://www.google.com/maps/dir/${booking.pickup.lat},${booking.pickup.lon}/${booking.delivery.lat},${booking.delivery.lon})`,
    {
      parse_mode: 'markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Nej',
              callback_data: JSON.stringify({
                a: false,
                id: msgOptions.correlationId,
                r: 'why?'
              }),
            },
            {
              text: 'Ja',
              callback_data: JSON.stringify({
                a: true,
                id: msgOptions.correlationId,
                r: 'why?'
              }),
            },
          ],
        ],
      },
    }
  )
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
  console.log('DO WE GET HERE', options)
  msg.editMessageReplyMarkup()
  msg.answerCbQuery()
  msg.reply(isAccepted ? 'Kul!' : 'Tråkigt, kanske nästa gång!')

  const replyQueue = replyQueues.get(options.id)
  console.log('reply queue', replyQueue)
  console.log('all values', replyQueues.entries())
  console.log('all keys', replyQueues.keys())

  if (!replyQueue) return Promise.reject(`missing reply queue for ${options.id}`)

  return open
    .then((conn) => conn.createChannel())
    .then((ch) => {
      ch.sendToQueue(replyQueue, Buffer.from(isAccepted.toString()), {
        correlationId: options.id,
      })
    })
    .catch(console.warn)
}

const sendPickupInstructions = (message) => {
  return bot.telegram.sendMessage(
    message.assigned_to.id,
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
  onBotStart,
  sendPickupOffer,
  sendPickupInstructions,
  onPickupConfirm,
  onPickupOfferResponse,
}
