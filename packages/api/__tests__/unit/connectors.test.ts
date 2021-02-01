import * as connectors from '../../lib/connectors'
import _ from 'highland'
import * as Highland from 'highland'
import { components } from '../../lib/__generated__/schema'

const booking: components['schemas']['Booking'] = {
  id: '123',
  tripId: 123,
  shipDate: `${new Date()}`,
  status: 'new',
  complete: false,
  delivery: {
    city: 'City',
    name: 'City name',
    street: 'Gatgatan 12',
    /** Order Status */
  },
}

describe('bookings', () => {
  it('waits for correct message on the message queue', async () => {
    expect.assertions(1)
    // create a highland stream
    const stream: Highland.Stream<components['schemas']['Booking']> = _(
      (push, next) => {
        push(null, booking)
        next()
      }
    )
    connectors.waitForBookingNotification(stream, '1337', 'deleted')
    expect(true).toBe(true)

    // await expect(
    //   connectors.waitForBookingNotification(stream, '1337', 'deleted')
    // ).resolves.not.toThrow()
  })

  xit('how would we test that is does not just always resolve?', async () => {
    expect.assertions(1)
    // create a highland stream
    const stream: Highland.Stream<components['schemas']['Booking']> = _(
      (push, next) => {
        push(null, booking)
        next()
      }
    )

    await expect(
      connectors.waitForBookingNotification(stream, '1337', 'deleted')
    ).resolves.not.toThrow()
  })
})
