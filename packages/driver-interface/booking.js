const { v4: uuidv4 } = require('uuid')
const open = require('./amqp')

const createBooking = booking => {
  const exchange = 'bookings'
  return open
    .then(conn => conn.createChannel())
    .then(ch =>
      ch
        .assertExchange(exchange, 'headers', { durable: false })
        .then(() =>
          ch.publish(exchange, '', Buffer.from(JSON.stringify(booking)))
        )
    )
    .catch(console.warn)
}

const init = bot => {
  bot.command('newbooking', ctx => {
    console.log(ctx)
    console.log(ctx.message)

    const booking = {
      id: uuidv4(),
      bookingDate: new Date().toISOString(),
      departure: {
        lon: 11.99705,
        lat: 57.7163245,
        address: 'Olskroksgatan 20',
      },
      destination: {
        lon: 11.9546502,
        lat: 57.6988286,
        address: 'Kaponjärgatan 4C',
      },
    }
    ctx.reply('Okej, då skapar vi en boking')
    createBooking(booking)
  })
}

module.exports = { init: bot => init(bot) }
