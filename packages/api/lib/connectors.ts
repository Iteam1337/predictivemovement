const amqp = require('fluent-amqp')(process.env.AMQP_URL || 'amqp://localhost')
import { components } from './__generated__/schema'

const publishDeleteBooking = (bookingId: string) => {
  return amqp
    .exchange('incoming_booking_updates', 'topic', {
      durable: true,
    })
    .publish(bookingId, 'deleted', {
      persistent: true,
    })
}

const publishCreateBooking = (booking: components['schemas']['Booking']) => {
  return amqp
    .exchange('incoming_booking_updates', 'topic', {
      durable: true,
    })
    .publish({ ...booking, assigned_to: null }, 'registered', {
      persistent: true,
    })
    .then(() =>
      console.log(` [x] Created booking '${JSON.stringify(booking, null, 2)}'`)
    )
}

const bookingNotifications = amqp
  .exchange('outgoing_booking_updates', 'topic', {
    durable: true,
  })
  .queue('booking_notifications.api', {
    durable: true,
  })
  .subscribe({ noAck: true }, [
    'new',
    'picked_up',
    'delivered',
    'delivery_failed',
    'deleted',
  ])
  .map((bookingRes) => {
    const booking = bookingRes.json()

    return {
      ...booking,
      status: bookingRes.fields.routingKey,
    }
  })

const waitForBookingNotification = (
  stream: bookingNotifications,
  bookingId: string,
  status: string
) =>
  new Promise(
    (resolve) =>
      stream
        .fork() // do we fork here or do we expect the caller to have forked the stream before?
        .filter(
          (notification: { booking: { id: any }; status: any }) =>
            notification.booking.id === bookingId &&
            notification.status === status
        )
        .head() // Only pick the first
        .done(resolve) // done consumes the stream
  )

export {
  publishDeleteBooking,
  publishCreateBooking,
  bookingNotifications,
  waitForBookingNotification,
}
