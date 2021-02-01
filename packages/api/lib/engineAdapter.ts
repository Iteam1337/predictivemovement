import {
  publishCreateBooking,
  publishDeleteBooking,
  waitForBookingNotification,
  bookingNotifications,
} from './connectors'

const deleteBooking = async (bookingId: string) => {
  await publishDeleteBooking(bookingId)
  await waitForBookingNotification(bookingNotifications, bookingId, 'deleted')
}

const createBooking = (booking: any) => {}

export { createBooking, deleteBooking }
