import { Handler } from 'openapi-backend'
import { Request, Response } from 'express'

export const getTransports: Handler = (c, req: Request, res: Response) => {
  res.status(200).json({ result: 'ok' })
}

export const getItinerary: Handler = (
  _,
  req: Request<{}, any, any, { transportId: string }>,
  res: Response
) => res.status(200).json({ result: 'ok', transportId: req.query.transportId })
