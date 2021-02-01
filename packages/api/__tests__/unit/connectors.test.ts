import * as connectors from '../../lib/connectors'
import _ from 'highland'

describe('bookings', () => {
  const bookingId = 'pmb-123'

  it('waits for correct message on the message queue', async () => {
    // create a highland stream
    const stream = _((push, next) => {
      push(null, { id: 1336, status: 'new' })
      push(null, { id: 1337, status: 'deleted' })
      push(null, { id: 1338, status: 'new' })
      next()
    })

    const notification = await connectors.waitForBookingNotification(
      stream,
      '1337',
      'deleted'
    )

    // how do we assert this?
    expect(notification.booking.id).toBe(1337)
    expect(notification.status).toBe('deleted')
  })
})
