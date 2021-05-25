import { Request } from 'express'
import { Handler } from 'openapi-backend'

export const get_transports: Handler = (c, req: Request, res) => {
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

export const get_itinerary: Handler = (c, req: Request, res) => {
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

export const get_plan: Handler = async (ctx, req: Request, res) => {
  const {poller} = req 
  
  setTimeout(
    () => poller.publish('plan', {my_great: 'plan'}),
    1500
  )
  const msg = await poller.for('plan')
  res.status(200).json(msg)

  console.log(req.id, poller)
}

