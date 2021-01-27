import { app } from '../lib/index'
import * as connectors from '../lib/connectors'
import request from 'supertest'

describe('DELETE /bookings/:id', () => {
  const bookingId = 'pmb-123'

  it('sends 400 if missing query param', () => {})

  it('fails to delete booking', () => {})

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
})
