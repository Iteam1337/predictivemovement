import { Handler } from 'openapi-backend'
import { Request, Response } from 'express'
import * as connectors from './connectors'

export const getTransports: Handler = (c, req: Request, res: Response) => {
  res.status(200).json({ result: 'ok' })
}

export const getItinerary: Handler = (
  _,
  req: Request<{}, any, any, { transportId: string }>,
  res: Response
) => res.status(200).json({ result: 'ok', transportId: req.query.transportId })

export const getBooking: Handler = (
  _,
  req: Request<{}, any, any, { bookingId: string }>,
  res: Response
) => res.status(200).json({ result: 'ok', bookingId: req.query.bookingId })

export const getMe: Handler = (_, req, res) =>
  res.status(200).json({ result: 'ok' })

export const deleteBooking: Handler = async (ctx, _, res: Response) => {
  const bookingId = ctx.request.params.booking_id
  try {
    await connectors.publishDeleteBooking(bookingId as string)
    // res.status(404).json({ error: 'Not found' })
    return res.status(200).json({ result: 'ok', bookingId })
  } catch (error) {
    console.error(error)
    return res.status(404)
  }
}
