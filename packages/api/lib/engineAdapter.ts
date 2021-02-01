import {
  publishDeleteBooking,
  waitForBookingNotification,
  bookingNotifications,
} from './connectors'

const deleteBooking = async (bookingId: string) => {
  await publishDeleteBooking(bookingId)
  await waitForBookingNotification(bookingNotifications, bookingId, 'deleted')
}

const createBooking = () => {}

export { createBooking, deleteBooking }
