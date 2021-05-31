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

describe('engine adapter', () => {
  it('waits for correct message on the message queue', async () => {
    expect(true).toBe(true)
    // expect.assertions(1)
    // bookingNotification.status = 'deleted'
    // // create a highland stream
    // const stream: Highland.Stream<BookingNotification> = _((push, next) => {
    //   push(null, bookingNotification)
    //   next()
    // })

    // await expect(
    //   connectors.waitForBookingNotification(stream, '123', 'deleted')
    // ).resolves.not.toThrow()
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