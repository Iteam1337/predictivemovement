const amqp = require('./amqp')

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

  amqp.updateLocation(message, ctx)
}

module.exports = { onMessage }
