import { Handler } from 'openapi-backend'

import { createBooking } from './engineAdapter'
import { operations } from './__generated__/schema'

export const get_transports: Handler = (c, req, res) => {
  /**
fail: body: At '/0/earliest_start' Missing required property: earliest_start
body: At '/0/latest_end' Missing required property: latest_end
body: At '/0/start_address' Missing required property: start_address
body: At '/0/end_address' Missing required property: end_address
   */
  res.status(200).json([
    {
      transport_id: '',
      busy: false,
      capacity: {
        volume: 0,
        weight: 0,
      },
      earliest_start: '2018-01-01 14:10:10',
      latest_end: 'tji',
      metadata: {},
      start_address: {
        city: '',
        street: '',
        name: '',
        position: {
          lat: 0,
          lon: 0
        }
      },
      end_address: {
        city: '',
        street: '',
        name: '',
        position: {
          lon: 0,
          lat: 0,
        }
      },
    },
  ])
}

export const get_itinerary: Handler = (
  c,
  req,
  res
) => {
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


export const create_booking: Handler = async (
  ctx,
  req,
  res
) => {
  type Body = operations['create_booking']['requestBody']['content']['application/json']
  const requestBody: Body = ctx.request.requestBody
  const booking = await createBooking(requestBody)
  // console.log({booking})
  res.status(201).json(booking)
}
