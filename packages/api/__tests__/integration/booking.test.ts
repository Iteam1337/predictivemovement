import { app } from '../../lib/index'
import * as connectors from '../../lib/connectors'
import request from 'supertest'

describe('DELETE /bookings/:id', () => {
  const bookingId = 'pmb-123'
  let mockConnector: any
  let bookings: any[] = []

  before(() => {
    mockConnector = {
      publishCreateBooking: (booking: any) =>
        Promise.resolve(bookings.push(booking)),
      publishDeleteBooking: (bookingId: string) => {
        bookings = bookings.filter((b) => b.id !== bookingId)
        return Promise.resolve('ok') || Promise.reject('not found')
      },
    }
  })

  xit('fails to publish delete booking message', async () => {
    const mockFn = jest.spyOn(connectors, 'publishDeleteBooking')
    const errorMsg = 'this is a test message'
    mockFn.mockRejectedValue(errorMsg)

    const { status, error } = await request(app).delete(
      `/bookings/${bookingId}`
    )

    if (error) {
      expect(error.text).toEqual(errorMsg)
    }

    expect(mockFn).toHaveBeenCalledWith(bookingId)
    expect(status).toBe(500)
  })

  it('deletes a booking and returns OK', async () => {
    const mockFn = jest.spyOn(connectors, 'publishDeleteBooking')
    mockFn.mockReturnValue(null)

    const { status, body } = await request(app).delete(`/bookings/${bookingId}`)

    expect(mockFn).toHaveBeenCalledWith(bookingId)
    expect(status).toBe(200)
    expect(body).toEqual({
      result: 'ok',
      bookingId: bookingId,
    })
  })

  xit('sends 404 if booking is already deleted', async () => {
    const { status: firstStatus } = await request(app).delete(
      `/bookings/${bookingId}`
    )
    expect(firstStatus).toBe(200)

    const { status, error } = await request(app).delete(
      `/bookings/${bookingId}`
    )
    expect(status).toBe(404)

    console.log('status: ', status)
    console.log('error: ', error)
  })
})
