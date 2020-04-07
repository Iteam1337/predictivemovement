const bot = require('./bot')
// const { rpcResponse } = require('./amqp')
const open = require('amqplib').connect('amqp://localhost')

const deliveryRequest = (chatId, msgOptions) => {
  console.log(chatId)
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
  const { a, ...options } = JSON.parse(msg.update.callback_query.data)

  if (!options || !options.r || !options.id) return
  return open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch.sendToQueue(options.r, Buffer.from(a.toString()), {
        correlationId: options.id,
      })
    )
    .catch(console.warn)
})

// bot.action('accept', (ctx, next) => {
//   console.log('ctx from accept', ctx)
//   callback(true)
//   ctx.reply('bokningen är din!').then(() => next())
// })

// bot.action('denial', (ctx, next) => {
//   callback(false)
//   ctx.reply('Okej! Vi letar vidare :)').then(() => next())
// })

module.exports = { deliveryRequest }
