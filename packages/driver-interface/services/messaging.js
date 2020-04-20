const bot = require('../adapters/bot')

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

const onDeliveryRequest = (chatId, msgOptions, { car, booking }) => {
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
  onBotStart,
  onDeliveryRequest,
  onPickupConfirm,
  onPackageDelivered,
  onDeliveryRequestResponse,
}
