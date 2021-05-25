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
  res.status(200).json({
    id: "foo",
    trip_id: ctx.request.requestBody.trip_id,
    delivery: ctx.request.requestBody.delivery,
    pickup: ctx.request.requestBody.pickup,
    ship_date: '2017-01-01',
    status: 'placed',
    details: {
      metadata: {
        cargo: "",
        fragile: false,
        recipient: {
          contact: "",
          name: "",
          info: "",
        },
        sender: {
          contact: "",
          name: "",
          info: "",
        },
      },
      quantity: 1,
      loading_meters: 1,
      weight: ctx.request.requestBody.size.weight,
      dimensions: ctx.request.requestBody.size.dimensions,
      volume: Object.values(ctx.request.requestBody.size.dimensions as {[key: string]: number})
                    .reduce((acc: number, next: number) => next * acc, 1),
    }
  })
}
