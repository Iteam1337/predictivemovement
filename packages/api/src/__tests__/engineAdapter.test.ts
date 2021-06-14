import { createBooking, CreateBookingInput } from '../engineAdapter'
import { amqp } from '../rabbitmqConnector'
describe('engine adapter', () => {

  afterAll(() => amqp.close())

  describe('#createBooking()', () => {
    it('generates an id and sends the booking payload to rabbit', async () => {
      expect.assertions(1)
      const bookingPayload = {
        pickup: { address: { position: { lat: 31.337, lon: 69.69 } } },
        delivery: { address: { position: { lat: 1.337, lon: 6.9 } } },
        metadata: {},
        size: {
          measurements: [105, 55, 16],
          weight: 10,
        },
      }

      const result = await createBooking(
        (bookingPayload as any) as CreateBookingInput
      )
      expect(result.id).toBeDefined()
    })
  })
})
