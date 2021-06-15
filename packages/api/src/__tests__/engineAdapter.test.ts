import { createBooking, CreateBookingInput } from '../booking/engineAdapter'
import { amqp } from '../amqp/connector'
import { createTransport, CreateTransportInput } from '../transport/engineAdapter'
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


  describe('#createTransport()', () => {
    it('generates an id and sends the transport payload to rabbit', async () => {
      expect.assertions(1)
      const transportPayload = {
        start_address: {position:  {lat: 31.337, lon: 69.69 }},
        end_address: {position: {lat: 1.337, lon: 6.9 } },
        capacity: {volume: 2, weight: 4}
      }

      const result = await createTransport(
        (transportPayload as any) as CreateTransportInput
      )
      expect(result.id).toBeDefined()
    })
  })
})
