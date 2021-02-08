import { app } from '../../lib/index'
import * as connectors from '../../lib/connectors'
import * as engineAdapter from '../../lib/engineAdapter'
import request from 'supertest'
import { components } from '../../lib/__generated__/schema'

const booking: components['schemas']['Booking'] = {
  id: 'pmb-123',
  tripId: 234,
  shipDate: new Date().toISOString(),
  status: 'new',
  complete: false,
}

describe('POST /bookings', () => {
  it('creates a booking and returns the booking id', async () => {
    const mockFn = jest.spyOn(engineAdapter, 'createBooking')
    mockFn.mockReturnValue(Promise.resolve())

    const { status, body } = await request(app).post(`/bookings`).send(booking)

    expect(mockFn).toHaveBeenCalledWith(booking)
    expect(status).toBe(200)
    expect(body).toEqual({
      result: 'ok',
      bookingId: booking.id,
    })
  })

  it('fails to create a booking', async () => {
    const mockFn = jest.spyOn(engineAdapter, 'createBooking')
    mockFn.mockReturnValue(Promise.resolve())

    const { status } = await request(app)
      .post(`/bookings`)
      .send({ booking: '123' })

    expect(status).toBe(400)
  })
})

describe('DELETE /bookings/:id', () => {
  const bookingId = 'pmb-123'

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
    const mockFn = jest.spyOn(engineAdapter, 'deleteBooking')
    mockFn.mockReturnValue(Promise.resolve())

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
