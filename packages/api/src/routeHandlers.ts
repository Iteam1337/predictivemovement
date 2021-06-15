import { Handler } from 'openapi-backend'
import { createBooking } from './booking/engineAdapter'
import { createTransport } from './transport/engineAdapter'
import { operations } from './__generated__/schema'

export const get_transports: Handler = (_c, _req, res) => {
  res.status(200).json([
    {
      id: '',
      busy: false,
      capacity: {
        volume: 0,
        weight: 0,
      },
      earliest_start: '2021-07-01T17:30:00Z',
      latest_end: '2021-07-01T21:30:00Z',
      metadata: {},
      start_address: {
        city: '',
        street: '',
        name: '',
        position: {
          lat: 0,
          lon: 0,
        },
      },
      end_address: {
        city: '',
        street: '',
        name: '',
        position: {
          lon: 0,
          lat: 0,
        },
      },
    },
  ])
}

export const get_itinerary: Handler = (c, _req, res) => {
  res.status(200).json({
    transport_id: c.request.params.transport_id,
    route: {},
    activities: [
      {
        id: '',
        booking_id: '',
        distance: 0,
        duration: 0,
        type: 'start',
        position: {
          lon: 0,
          lat: 0,
        },
      },
    ],
  })
}

export const create_booking: Handler = async (ctx, req, res) => {
  type Body = operations['create_booking']['requestBody']['content']['application/json']
  const requestBody: Body = ctx.request.requestBody
  const booking = await createBooking(requestBody)
  res.status(201).json(booking)
}

export const create_transport: Handler = async (ctx, req, res) => {
  type Body = operations['create_transport']['requestBody']['content']['application/json']
  const requestBody: Body = ctx.request.requestBody
  const transport = await createTransport(requestBody)
  res.status(201).json(transport)
}
