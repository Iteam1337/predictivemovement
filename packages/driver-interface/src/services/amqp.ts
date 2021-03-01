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

export const publishTransportEvent = (
  transportId: string,
  event: string
): Promise<boolean | void> =>
  open
    .then((conn) => conn.createChannel())
    .then((openChannel) =>
      openChannel
        .assertExchange(exchanges.INCOMING_VEHICLE_UPDATES, 'topic', {
          durable: true,
        })
        .then(() =>
          openChannel.publish(
            exchanges.INCOMING_VEHICLE_UPDATES,
            event,
            Buffer.from(JSON.stringify({ id: transportId, status: event })),
            {
              persistent: true,
            }
          )
        )
    )
    .catch(console.warn)

type PhotoReceipt = {
  type: 'photo'
  receipt: { photoId: string }
  createdAt: Date
  bookingId: string
  transportId: string
  signedBy: string
}

type ManualReceipt = {
  type: 'manual'
  createdAt: Date
  bookingId: string
  transportId: string
  signedBy: string
}

export const publishReceiptByManual = (
  receipt: ManualReceipt
): Promise<boolean | void> =>
  open
    .then((conn) => conn.createChannel())
    .then((openChannel) =>
      openChannel
        .assertExchange(exchanges.DELIVERY_RECEIPTS, 'topic', {
          durable: true,
        })
        .then(() =>
          openChannel.publish(
            exchanges.DELIVERY_RECEIPTS,
            'new',
            Buffer.from(JSON.stringify({ receipt })),
            {
              persistent: true,
            }
          )
        )
    )
    .catch(console.warn)

export const publishReceiptByPhoto = (
  receipt: PhotoReceipt
): Promise<boolean | void> =>
  open
    .then((conn) => conn.createChannel())
    .then((openChannel) =>
      openChannel
        .assertExchange(exchanges.DELIVERY_RECEIPTS, 'topic', {
          durable: true,
        })
        .then(() =>
          openChannel.publish(
            exchanges.DELIVERY_RECEIPTS,
            'new',
            Buffer.from(JSON.stringify({ receipt })),
            {
              persistent: true,
            }
          )
        )
    )
    .catch(console.warn)
