import Position from 'Position'
import randomize, { setDefaults } from '../../util/randomAddress'
import * as routeApi from '../routeApi'

jest.mock('../routeApi')
jest.mock('../../adapters/socket')
jest.mock('../../util/randomAddress')

jest.mock('../../config', () => ({
  count: 5,
  destination: {
    lat: 1337.0147,
    lon: 13.013,
  },
  radiusInKm: 500,
}))

import * as service from '../genRequests'

describe('#genRequests', () => {
  let randomizeMock: jest.Mock
  let infoMock: jest.Mock
  let logMock: jest.Mock
  let routeApiMock: { newRoute: jest.Mock; newPickup: jest.Mock }

  let destination: Position
  beforeEach(() => {
    infoMock = jest.fn()
    logMock = jest.fn()

    randomizeMock = randomize as jest.Mock
    routeApiMock = routeApi as any

    console.log = logMock
    console.info = infoMock

    destination = { lat: 1337.0147, lon: 13.013 }
  })

  test('calling "randomize"', async () => {
    await service.genRequests()

    expect(randomizeMock).toBeCalledTimes(5)
    expect(randomizeMock).toBeCalledWith()
  })

  test('calling "routeApi"', async () => {
    randomizeMock.mockResolvedValue({ lat: 1.1, lon: 4.4 })

    await service.genRequests()

    expect(routeApiMock.newRoute, 'driver').toBeCalledTimes(1)
    expect(routeApiMock.newPickup, 'passenger').toBeCalledTimes(4)
    expect(routeApiMock.newRoute).nthCalledWith(
      1,
      { lat: 1.1, lon: 4.4 },
      destination
    )
    expect(routeApiMock.newPickup).nthCalledWith(
      1,
      { lat: 1.1, lon: 4.4 },
      destination
    )
  })

  test('closing sockets on end', async () => {
    const socket = { close: jest.fn() }

    randomizeMock.mockResolvedValue({ lat: 1.1, lon: 4.4 })
    routeApiMock.newRoute.mockResolvedValue(socket)
    routeApiMock.newPickup.mockResolvedValue(socket)

    await service.genRequests()

    expect(socket.close).toBeCalledTimes(5)
  })

  test('returning all successful points', async () => {
    randomizeMock.mockResolvedValue({ lat: 1.1, lon: 4.4 })

    const points = await service.genRequests()

    expect(points).toHaveLength(5)
    expect(points).toEqual(expect.arrayContaining([{ lat: 1.1, lon: 4.4 }]))
  })

  describe('default args', () => {
    test('no arguments', async () => {
      await service.genRequests()

      expect(setDefaults).toBeCalledTimes(1)
      expect(randomize).toBeCalledTimes(5)
    })

    test('"destination"', async () => {
      await service.genRequests({})
      await service.genRequests({ destination: { lat: 0, lon: 0 } })

      expect(setDefaults).toBeCalledTimes(2)

      expect(setDefaults).nthCalledWith(1, { lat: 1337.0147, lon: 13.013 }, 500)
      expect(setDefaults).nthCalledWith(2, { lat: 0, lon: 0 }, 500)
    })

    test('"count"', async () => {
      await service.genRequests({})
      expect(randomize).toBeCalledTimes(5)

      randomizeMock.mockReset()

      await service.genRequests({ count: 4 })
      expect(randomize).toBeCalledTimes(4)
    })
  })

  describe('errors', () => {
    test('only add successful random-points', async () => {
      randomizeMock.mockResolvedValueOnce({ lat: 1.1, lon: 1.1 })
      randomizeMock.mockResolvedValueOnce({ lat: 2.2, lon: 2.2 })
      randomizeMock.mockRejectedValue('some error')
      randomizeMock.mockRejectedValue('some error')
      randomizeMock.mockResolvedValueOnce({ lat: 3.3, lon: 3.3 })

      const points = await service.genRequests()

      expect(points).toHaveLength(3)
      expect(points).toEqual([
        { lat: 2.2, lon: 2.2 },
        { lat: 3.3, lon: 3.3 },
        { lat: 1.1, lon: 1.1 }, // points where spliced at start for drivers
      ])
    })

    test('only return successful routeApi-requests', async () => {
      const values = [1.1, 2.2, 3.3, 4.4, 5.5]

      values.forEach(n =>
        randomizeMock.mockResolvedValueOnce({ lat: n, lon: n })
      )
      routeApiMock.newPickup.mockRejectedValueOnce('error')
      routeApiMock.newRoute.mockRejectedValueOnce('error')

      const points = await service.genRequests()

      expect(points).toHaveLength(3)
      expect(points).toEqual([
        { lat: values[2], lon: values[2] },
        { lat: values[3], lon: values[3] },
        // call #0 should have failed
        // call #1 should have failed
        { lat: values[4], lon: values[4] },
      ])
      expect(logMock).toBeCalledWith('failed to add driver')
      expect(logMock).toBeCalledWith('failed to add passenger')
    })
  })
})
