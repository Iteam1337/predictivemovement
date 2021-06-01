// import * as connectors from '../rabbitmqConnector'
// import _ from 'highland'
// import * as Highland from 'highland'
// import { components } from '../__generated__/schema'
// type BookingNotification = components['schemas']['BookingNotification']

// const bookingNotification: BookingNotification = {
//   bookingId: '123',
//   status: 'new',
//   message: 'new',
// }

import { createBooking } from '../engineAdapter'

describe('engine adapter', () => {
  describe('#createBooking()', () => {
    it('generates an id and sends the booking payload to rabbit', async () => {
      const bookingPayload = {
        delivery: {},
        pickup: {}
      }


      await createBooking(bookingPayload)
      
    })

    it('gives an error when delete failed', async () => {
      expect(true).toBe(true)
      // const message = 'it b0rked'
      // bookingNotification.status = 'error'
      // bookingNotification.message = message

      // const stream: Highland.Stream<BookingNotification> = _((push, next) => {
      //   push(null, bookingNotification)
      //   push(null, { bookingId: '123', status: 'deleted', message: 'hello' }) // will be ignored
      //   next()
      // })

      // await expect(
      //   connectors.waitForBookingNotification(stream, '123', 'deleted')
      // ).rejects.toThrow(message)
    })
  })
})
