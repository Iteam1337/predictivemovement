const { open, exchanges } = require('../adapters/amqp')

const createBooking = (booking) => {
  return open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertExchange(exchanges.INCOMING_BOOKING_UPDATES, 'topic', {
          durable: true,
        })
        .then(() =>
          ch.publish(
            exchanges.INCOMING_BOOKING_UPDATES,
            'registered',
            Buffer.from(JSON.stringify({ ...booking, assigned_to: null })),
            {
              persistent: true,
            }
          )
        )
    )
    .catch(console.warn)
}

const publishFreightslipPhoto = (freightslip) =>
  open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertExchange(exchanges.FREIGHTSLIPS, 'topic', {
          durable: true,
        })
        .then(() =>
          ch.publish(exchanges.freightslips, 'new', Buffer.from(freightslip), {
            persistent: true,
          })
        )
    )
    .catch(console.warn)

module.exports = { createBooking, publishFreightslipPhoto }
