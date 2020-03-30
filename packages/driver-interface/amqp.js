const open = require('amqplib').connect('amqp://localhost')

const exchanges = {
  BOOKINGS: 'bookings',
  BOOKING_SUGGESTIONS: 'booking_suggestions',
}

const queues = {
  BOOKING_SUGGESTIONS: 'booking_suggestions',
}

const registerHandlers = () => {
  open
    .then(conn => conn.createChannel())
    .then(ch => {
      // this isn't working properly...

      return ch
        .assertQueue(queues.BOOKING_SUGGESTIONS, { durable: false })
        .then(() =>
          ch.assertExchange(exchanges.BOOKING_SUGGESTIONS, 'fanout', {
            durable: false,
          })
        )

        .then(() =>
          ch.bindQueue(
            queues.BOOKING_SUGGESTIONS,
            exchanges.BOOKING_SUGGESTIONS
          )
        )
    })
    .catch(console.warn)

  open
    .then(conn => conn.createChannel())
    .then(ch =>
      ch.consume(queues.BOOKING_SUGGESTIONS, msg => {
        console.log('receiving msg from queue:', msg.content.toString())
        const message = JSON.parse(msg.content)

        bot.telegram.sendMessage(message.id, 'Hello there')

        ch.ack(msg)
      })
    )
}

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

module.exports = { open, createBooking, registerHandlers }
