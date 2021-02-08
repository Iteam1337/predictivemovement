import { Handler } from 'openapi-backend'
import { Request, Response } from 'express'
import * as engineAdapter from '../lib/engineAdapter'
import { components } from './__generated__/schema'

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

export const createBooking: Handler = async (
  _,
  req: Request<{}, any, components['schemas']['Booking']>,
  res: Response
) => {
  await engineAdapter.createBooking(req.body)
  res.status(200).json({ result: 'ok', bookingId: req.body.id })
}

export const deleteBooking: Handler = async (ctx, _, res: Response) => {
  const bookingId = ctx.request.params.booking_id
  try {
    await engineAdapter.deleteBooking(bookingId as string)
    return res.status(200).json({ result: 'ok', bookingId })
  } catch (error) {
    return res.status(500).send(error)
  }
}
