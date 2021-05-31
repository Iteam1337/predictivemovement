import {
  publishDeleteBooking,
  waitForBookingNotification,
  bookingNotifications,
  publishCreateBooking,
} from './rabbitmqConnector'
import { components } from './__generated__/schema'

const deleteBooking = async (bookingId: string) => {
  await publishDeleteBooking(bookingId)
  await waitForBookingNotification(bookingNotifications, bookingId, 'deleted')
}

const createBooking = async (booking: components['schemas']['Booking']) => {
  await publishCreateBooking(booking)
  await waitForBookingNotification(bookingNotifications, booking.id, 'new')
}

export { createBooking, deleteBooking }



/*

1. Api generates an ID and adds that to payload and sends it to Rabbit
2. Engine will use that ID for spawning a Booking Process
3. pushes a message to Rabbit to booking_updates exchange with key "new"
{
  id: 'pmb-123s',
  delivery: {},
  pickup: {},
  external_id: 'some ID that UI has sent'
}
4. API will filter on booking_updates queue for keys `new` and `error` and id `pmb-123s`
In case of errors in the Engine or the ID not being valid Engine will push the error to booking_updates exchange with key `error` and includes the id `pmb-123s` and error message
*/