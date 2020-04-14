const bot = require('./bot')
const open = require('amqplib').connect('amqp://localhost')
const Markup = require('telegraf/markup')

const deliveryRequest = (chatId, msgOptions, { car, booking }) => {
  console.log('msgOptions', car)
  console.log('msgOptions', booking)
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

bot.action('confirm', (ctx) => {
  console.log(ctx)
  ctx.reply('yay')
})

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
    .then((ch) => {
      ch.sendToQueue(options.r, Buffer.from(isAccepted.toString()), {
        correlationId: options.id,
      })
      return ch
    })
    .then(
      (ch) =>
        new Promise((resolve) =>
          ch.consume('pickup_instructions', (msg) => {
            ch.ack(msg)
            resolve(msg)
          })
        )
    )
    .then((data) => JSON.parse(data.content.toString()))
    .then((instructions) => {
      console.log('received instructions', instructions)
      msg.replyWithMarkdown(
        `Bra du ska nu åka hit [Starta GPS](https://www.google.com/maps/dir/?api=1&&destination=${instructions.booking.departure.lat},${instructions.booking.departure.lon})`,
        Markup.inlineKeyboard([
          Markup.callbackButton('Hämtat', 'confirm'),
        ]).extra()
      )
    })
    .catch(console.warn)
})

module.exports = {
  deliveryRequest,
}
