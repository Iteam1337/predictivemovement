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

const sendPickupOffer = (chatId, msgOptions, { car, booking }) => {
  console.log({ car, booking })

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

const onPickupConfirm = (ctx) => {
  return ctx.replyWithMarkdown(
    `Härligt, nu kan du köra paketet till <insert en destination>`,
    Markup.inlineKeyboard([
      Markup.callbackButton('Levererat', 'delivered'),
    ]).extra()
  )
}

const onPickupOfferResponse = (isAccepted, options, msg) => {
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

const sendPickupInstructions = (message) =>
  bot.telegram.sendMessage(
    message.car.id,
    `Bra du ska nu åka hit [Starta GPS](https://www.google.com/maps/dir/?api=1&&destination=${message.booking.departure.lat},${message.booking.departure.lon})`,
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

module.exports = {
  onBotStart,
  sendPickupOffer,
  sendPickupInstructions,
  onPickupConfirm,
  onPickupOfferResponse,
}
