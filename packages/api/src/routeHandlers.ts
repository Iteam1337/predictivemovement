import { Handler } from 'openapi-backend'
import { Request, Response } from 'express'

export const getTransports: Handler = (c, req: Request, res: Response) => {
  res.status(200).json([
    {
      transport_id: '',
      busy: false,
      capacity: {
        volume: 0,
        weight: 0,
      },
      earliestStart: '',
      latestEnd: '',
      metadata: {},
      startAddress: {
        city: '',
        street: '',
        name: '',
        position: '',
      },
      endAddress: {
        city: '',
        street: '',
        name: '',
        lon: 0,
        lat: 0,
      },
    },
  ])
}

export const getItinerary: Handler = (
  _,
  req: Request<{}, any, any, { transportId: string }>,
  res: Response
) =>
  res.status(200).json({
    transport_id: req.query.transportId,
    route: {},
    activities: [
      {
        id: '',
        booking_id: '',
        distance: 0,
        duration: 0,
        type: 'start',
        address: {
          schema: {
            lon: 0,
            lat: 0,
          },
        },
      },
    ],
  })
