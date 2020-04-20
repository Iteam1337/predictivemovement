// const { open } = require('./amqp')
const {
  open,
  exchanges: { CARS },
} = require('./amqp')

const init = (bot) => {
  bot.on('message', (ctx) => {
    const msg = ctx.message
    onMessage(msg, ctx)
  })

  bot.on('edited_message', (ctx) => {
    const msg = ctx.update.edited_message
    onMessage(msg, ctx)
  })

  const onMessage = (msg, ctx) => {
    if (!msg.location) return

    const position = {
      lon: msg.location.longitude,
      lat: msg.location.latitude,
    }

    const username = msg.from.username
    const message = {
      username,
      id: msg.from.id,
      // chatId: msg.chat.id, // this borks engine-elixir
      position,
      // date: Date(msg.edit_date),
    }

    updateLocation(message, ctx)
  }

  const updateLocation = (msg, ctx) => {
    // Publisher
    open
      .then((conn) => conn.createChannel())
      .then((ch) => {
        ch.assertExchange(CARS, 'fanout', {
          durable: false,
        }).then(() => ch.publish(CARS, '', Buffer.from(JSON.stringify(msg))))
      })

      .catch(console.warn)
  }
}

module.exports = { init }
