const { open } = require('./amqp')

const init = bot => {
  const exchange = 'booking_suggestions'
  const queue = 'booking_suggestions'
  open
    .then(conn => conn.createChannel())
    .then(ch => {
      ch.assertExchange(exchange, 'fanout', {
        durable: false,
      })
      ch.assertQueue(queue)
      ch.bindQueue(queue, exchange)
    })
    .catch(console.warn)

  open
    .then(conn => conn.createChannel())
    .then(ch =>
      ch.consume(queue, msg => {
        console.log('receiving msg from queue:', msg.content.toString())
        const message = JSON.parse(msg.content)

        bot.telegram.sendMessage(message.id, 'Hello there')

        ch.ack(msg)
      })
    )

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
      chatId: msg.chat.id,
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
          .assertExchange('cars', 'fanout', { durable: false })
          .then(() => ch.publish('cars', '', Buffer.from(JSON.stringify(msg))))
      )
      .catch(console.warn)
  }
}

module.exports = { init }
