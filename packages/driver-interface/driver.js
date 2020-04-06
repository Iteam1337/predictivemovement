const { open } = require('./amqp')
const amqp = require('./amqp')

const init = bot => {
  bot.on('message', ctx => {
    const msg = ctx.message
    onMessage(msg)
  })

  bot.on('edited_message', ctx => {
    const msg = ctx.update.edited_message
    onMessage(msg)
  })

  const onMessage = msg => {
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
      date: Date(msg.edit_date),
    }

    updateLocation(message)
  }

  const updateLocation = msg => {
    // Publisher
    open
      .then(conn => conn.createChannel())
      .then(ch =>
        ch
          .assertExchange(amqp.exchanges.CARS, 'fanout', { durable: false })
          .then(() => ch.publish('cars', '', Buffer.from(JSON.stringify(msg))))
      )
      .catch(console.warn)
  }
}

module.exports = { init }
