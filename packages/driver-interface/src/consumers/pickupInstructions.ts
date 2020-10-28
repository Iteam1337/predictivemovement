import { Replies } from 'amqplib'
import { open, queues, exchanges } from '../adapters/amqp'

import cache from '../services/cache'

const { ADD_BOOKING_INFO } = queues
const { OUTGOING_BOOKING_UPDATES } = exchanges

const pickupInstructions = (): Promise<Replies.Consume> =>
  open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(ADD_BOOKING_INFO, {
          durable: true,
        })
        .then(() =>
          ch.assertExchange(OUTGOING_BOOKING_UPDATES, 'topic', {
            durable: true,
          })
        )
        .then(() =>
          ch.bindQueue(ADD_BOOKING_INFO, OUTGOING_BOOKING_UPDATES, 'assigned')
        )
        .then(() =>
          ch.consume(ADD_BOOKING_INFO, async (msg) => {
            const booking = JSON.parse(msg.content.toString())
            console.log('received booking: ', booking)

            await cache.addBooking(booking.id, booking)

            ch.ack(msg)
          })
        )
    )

export default pickupInstructions
