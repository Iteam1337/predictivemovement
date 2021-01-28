import {
  publishCreateBooking,
  publishDeleteBooking,
  waitForMessage,
} from './connectors'

const deleteBooking = async (bookingId: string) => {
  await publishDeleteBooking(bookingId)
  await waitForMessage('DELETED:' + bookingId)
}

const createBooking = (booking: any) => {}

export { createBooking, deleteBooking }
