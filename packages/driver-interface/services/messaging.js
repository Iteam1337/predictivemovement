const bot = require('../adapters/bot')
const Markup = require('telegraf/markup')
const { open } = require('../adapters/amqp')

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
  bot.telegram.sendMessage(
    chatId,
    `Ett paket finns att hämta på ${pickupAddress}. Det ska levereras till ${deliveryAddress}. Har du möjlighet att hämta detta?
    [Se på kartan](https://www.google.com/maps/dir/${booking.departure.lat},${booking.departure.lon}/${booking.destination.lat},${booking.destination.lon})`,
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
                r: msgOptions.replyQueue,
              }),
            },
            {
              text: 'Ja',
              callback_data: JSON.stringify({
                a: true,
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

  console.log(isAccepted.toString())
  return open
    .then((conn) => conn.createChannel())
    .then((ch) => {
      ch.sendToQueue(options.r, Buffer.from(isAccepted.toString()), {
        correlationId: options.id,
      })
    })
    .catch(console.warn)
}

const sendPickupInstructions = (message) => {
  return bot.telegram.sendMessage(
    message.car.id,
    `Hämta paketet [här](https://www.google.com/maps/dir/?api=1&&destination=${message.booking.departure.lat},${message.booking.departure.lon})!`,
    {
      parse_mode: 'markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Hämtat',
              callback_data: JSON.stringify({
                e: 'pickup',
                id: message.booking.senderId,
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
