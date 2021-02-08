import {
  publishDeleteBooking,
  waitForBookingNotification,
  bookingNotifications,
  publishCreateBooking,
} from './connectors'
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
