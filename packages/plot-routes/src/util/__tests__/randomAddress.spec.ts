import { Waypoint } from 'OSRM'

jest.mock('../../config', () => ({
  destination: {
    lon: 16.0016,
    lat: 15.0016,
  },
  radiusInKm: 50,
}))

jest.mock('../../services/osrm')

import osrm from '../../services/osrm'
import * as util from '../randomAddress'

describe('#genRandomPoint', () => {
  it('should generate a point in specified range', () => {
    const notSoRandom = jest.fn()
    global.Math.random = notSoRandom

    notSoRandom.mockReturnValueOnce(0.0)
    notSoRandom.mockReturnValueOnce(0.0)

    const firstPoint = util.genRandomPoint()

    expect(firstPoint.lat).toEqual(util.latMin)
    expect(firstPoint.lon).toEqual(util.lonMin)

    notSoRandom.mockReturnValueOnce(1.0)
    notSoRandom.mockReturnValueOnce(1.0)

    const secondPoint = util.genRandomPoint()

    expect(secondPoint.lat).toEqual(util.latMax)
    expect(secondPoint.lon).toEqual(util.lonMax)
  })
})

describe('#randomize', () => {
  let notSoRandom: jest.Mock
  let nearest: jest.Mock

  let waypoint: Waypoint
  beforeEach(() => {
    notSoRandom = jest.fn()
    global.Math.random = notSoRandom

    nearest = osrm.nearest as jest.Mock

    waypoint = {
      name: 'foo',
      location: [13, 31],
      hint: 'bar',
      distance: 0,
    }

    nearest.mockResolvedValue({
      waypoints: [waypoint],
    })
  })

  it('calls osrm.nearest', async () => {
    notSoRandom.mockReturnValue(0.0)

    await util.randomize()

    expect(osrm.nearest).toBeCalledWith({ lat: util.latMin, lon: util.lonMin })
  })

  it('returns the expected value', async () => {
    notSoRandom.mockReturnValue(0.0)

    const res = await util.randomize()

    expect(res).toEqual({ lat: 31, lon: 13 })
  })

  it('retries utin name and location exists in response', async () => {
    nearest.mockResolvedValueOnce({
      waypoints: [
        {
          name: 'first',
          location: [],
          hint: 'missing location',
          distance: 0,
        },
      ],
    })

    nearest.mockResolvedValueOnce({
      waypoints: [
        {
          name: 'second',
          location: [],
          hint: 'missing name',
          distance: 0,
        },
      ],
    })

    nearest.mockResolvedValueOnce({
      waypoints: [waypoint],
    })

    await util.randomize()

    expect(osrm.nearest).toBeCalledTimes(3)
  })

  it('throws an error if limit has been reached', async () => {
    try {
      await util.randomize(Infinity)
      expect(1).toEqual(2)
    } catch (err) {
      expect(err).toEqual(expect.any(Error))
    }
  })
})
