import { RequestHandler } from 'express'
import genRequests from '../services/genRequests'
import hasProp from '../util/hasProp'

let running = false

export const handler: RequestHandler = async ({ query }, res) => {
  if (running) {
    return res.status(409).send({ status: 'generate in progress' })
  }

  running = true

  let destinationJSON: any
  try {
    destinationJSON = JSON.parse(
      hasProp(query, 'destination') && query.destination
    )
  } catch (_) {
    //
  }

  const wait = hasProp(query, 'wait') && query.wait === 'true'

  const count =
    hasProp(query, 'count') &&
    !isNaN(Number.parseFloat(query.count)) &&
    Number.parseInt(query.count, 10)
  const radiusInKm =
    hasProp(query, 'radiusInKm') &&
    !isNaN(Number.parseFloat(query.radiusInKm)) &&
    Number.parseInt(query.radiusInKm, 10)

  const params = {
    destination:
      destinationJSON &&
      hasProp(destinationJSON, 'lat') &&
      hasProp(destinationJSON, 'lon') &&
      typeof destinationJSON.lat === 'number' &&
      typeof destinationJSON.lon === 'number'
        ? destinationJSON
        : undefined,
    radiusInKm:
      typeof radiusInKm === 'number'
        ? Math.max(1, Math.min(radiusInKm, 200))
        : undefined,
    count:
      typeof count === 'number' ? Math.max(1, Math.min(count, 256)) : undefined,
  }

  if (!wait) {
    res.status(200).send(null)

    await genRequests(params).then(() => {
      running = false
    })

    return
  }

  res.status(200).json(await genRequests(params))

  running = false
}

export default handler
