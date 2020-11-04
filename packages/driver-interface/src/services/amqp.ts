import { open, exchanges } from '../adapters/amqp'
import { LocationMessage } from '../types'

export const updateLocation = (msg: LocationMessage): void => {
  open
    .then((conn) => conn.createChannel())
    .then((ch) => {
      ch.assertExchange(exchanges.INCOMING_VEHICLE_UPDATES, 'topic', {
        durable: true,
      }).then(() =>
        ch.publish(
          exchanges.INCOMING_VEHICLE_UPDATES,
          'incoming.updated.location',
          Buffer.from(JSON.stringify(msg)),
          {
            persistent: true,
          }
        )
      )
    })
    .catch(console.warn)
}

export const publishBookingEvent = (
  bookingId: string,
  event: string
): Promise<boolean | void> =>
  open
    .then((conn) => conn.createChannel())
    .then((openChannel) =>
      openChannel
        .assertExchange(exchanges.INCOMING_BOOKING_UPDATES, 'topic', {
          durable: true,
        })
        .then(() =>
          openChannel.publish(
            exchanges.INCOMING_BOOKING_UPDATES,
            event,
            Buffer.from(JSON.stringify({ id: bookingId, status: event })),
            {
              persistent: true,
            }
          )
        )
    )
    .catch(console.warn)
