const {
  open,
  queues: { PICKUP_INSTRUCTIONS },
  exchanges: { BOOKING_ASSIGNMENTS },
} = require('../adapters/amqp')

const pickupInstructions = () => {
  return open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(PICKUP_INSTRUCTIONS, {
          durable: false,
        })
        .then(() =>
          ch.assertExchange(BOOKING_ASSIGNMENTS, 'fanout', {
            durable: false,
          })
        )
        .then(() => ch.bindQueue(PICKUP_INSTRUCTIONS, BOOKING_ASSIGNMENTS))
        .then(
          () =>
            new Promise((resolve) => {
              ch.consume(PICKUP_INSTRUCTIONS, (msg) => {
                const message = JSON.parse(msg.content.toString())
                ch.ack(msg)
                resolve(message)
              })
            })
        )
        .then((instructions) => {
          bot.telegram.sendMessage(
            instructions.id,
            `Bra du ska nu åka hit [Starta GPS](https://www.google.com/maps/dir/?api=1&&destination=${instructions.booking.departure.lat},${instructions.booking.departure.lon})`,
            {
              parse_mode: 'markdown',
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: 'Hämtat',
                      callback_data: 'confirm',
                    },
                  ],
                ],
              },
            }
          )
        })
    )
}

module.exports = pickupInstructions
