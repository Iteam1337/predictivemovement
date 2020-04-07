const bot = require('./bot')
const open = require('amqplib').connect('amqp://localhost')

const deliveryRequest = (chatId, msgOptions) => {
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

bot.on('callback_query', (msg) => {
  let isAccepted
  let options

  try {
    const { a, ...opt } = JSON.parse(msg.update.callback_query.data)
    isAccepted = a
    options = opt
  } catch (error) {
    return
  }

  if (!options || !options.r || !options.id) return

  msg.editMessageReplyMarkup()
  msg.answerCbQuery()
  msg.reply(isAccepted ? 'Kul!' : 'Tråkigt!')

  return open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch.sendToQueue(options.r, Buffer.from(isAccepted.toString()), {
        correlationId: options.id,
      })
    )
    .catch(console.warn)
})

module.exports = { deliveryRequest }
