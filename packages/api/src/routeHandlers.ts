import { Handler } from 'openapi-backend'

export const get_transports: Handler = (c, req, res) => {
  res.status(200).json([
    {
      transport_id: '',
      busy: false,
      capacity: {
        volume: 0,
        weight: 0,
      },
      earliest_start: '',
      latest_end: '',
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

export const create_booking: Handler = (
  ctx,
  req,
  res
) => {
console.log(JSON.stringify(ctx.request.requestBody, null, 2))
  res.status(200).json({
    id: "foo",
    delivery: ctx.request.requestBody.delivery,
    pickup: ctx.request.requestBody.pickup,
    ship_date: '2017-01-01',
    status: 'placed',
    size: ctx.request.requestBody.size,
    metadata: ctx.request.requestBody.metadata,
  })
}
