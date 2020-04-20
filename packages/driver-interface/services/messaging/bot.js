const bot = require('../../bot')

const deliveryRequest = (chatId, msgOptions, { car, booking }) => {
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

module.exports = { deliveryRequest }
