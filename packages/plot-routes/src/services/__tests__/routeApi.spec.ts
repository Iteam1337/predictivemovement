import Position from 'Position'

import * as socket from '../../adapters/socket'
import routeApi from '../../adapters/routeApi'
import sleep from '../../util/sleep'
import genPayload from '../../util/genPayload'

jest.mock('../../util/genPayload')
jest.mock('../../util/sleep')
jest.mock('../../adapters/routeApi')
jest.mock('../../adapters/socket')

import * as service from '../routeApi'

let payload: { foo: string }
let genSocket: any
let startPosition: Position
beforeEach(() => {
  payload = { foo: 'bar' }
  genSocket = {
    on: jest.fn(),
    emit: jest.fn(),
    close: jest.fn(),
  }
  ;(genPayload as jest.Mock).mockReturnValue(payload)
  ;(socket.newSocket as jest.Mock).mockImplementation(() => genSocket)
  ;(routeApi.get as jest.Mock).mockResolvedValue(null)
  ;(sleep as jest.Mock).mockResolvedValue(null)
  startPosition = { lat: 0, lon: 13 }
})

describe('#newPickup', () => {
  test('gets payload', () => {
    service.newPickup(startPosition)
    expect(genPayload).toBeCalledWith(startPosition)
  })

  test('gets socket', () => {
    service.newPickup(startPosition)
    expect(socket.newSocket).toBeCalled()
  })

  test('listens to events', async () => {
    const on = genSocket.on as jest.Mock

    on.mockImplementation((_event, callback) => callback())

    await service.newPickup(startPosition).catch(() => {})

    expect(on).toBeCalledTimes(2)
    expect(on).toBeCalledWith('connect', expect.any(Function))
    expect(on).toBeCalledWith('disconnect', expect.any(Function))
  })

  describe('@on.connect', () => {
    let on: jest.Mock
    let emit: jest.Mock
    beforeEach(() => {
      on = genSocket.on
      emit = genSocket.emit

      on.mockImplementation((event, callback) => {
        if (event === 'connect') callback()
      })
    })

    test('it emits an event (passenger)', async () => {
      await service.newPickup(startPosition)

      expect(emit).toBeCalled()
      expect(emit).toBeCalledWith(
        'event',
        JSON.stringify({
          payload,
          type: 'passenger',
        })
      )
    })

    test('resolves the promise, after waiting, with socket', async () => {
      const response = await service.newPickup(startPosition)
      expect(sleep).toBeCalled()
      expect(response).toEqual(genSocket)
    })

    test('if something throws, reject (and closes socket)', async () => {
      emit.mockImplementation(() => {
        throw new Error('emit-error')
      })
      ;(sleep as jest.Mock).mockImplementation(() => {
        throw new Error('sleep-error')
      })

      await service.newPickup(startPosition).catch(() => {})
      expect(genSocket.close, 'emit-error').toBeCalledTimes(1)

      await service.newPickup(startPosition).catch(() => {})
      expect(genSocket.close, 'sleep-error').toBeCalledTimes(2)
    })
  })

  describe('@on.disconnect', () => {
    test('rejects the promise, and closes socket', async () => {
      ;(genSocket.on as jest.Mock).mockImplementation((event, callback) => {
        if (event === 'disconnect') callback()
      })

      await service.newPickup(startPosition).catch(() => {})
      expect(genSocket.close).toBeCalledTimes(1)
    })
  })
})

describe('#newRoute', () => {
  test('gets payload', () => {
    service.newRoute(startPosition)
    expect(genPayload).toBeCalledWith(startPosition)
  })

  test('gets socket', () => {
    service.newRoute(startPosition)
    expect(socket.newSocket).toBeCalled()
  })

  let on: jest.Mock
  let emit: jest.Mock
  beforeEach(() => {
    on = genSocket.on as jest.Mock
    emit = genSocket.emit as jest.Mock
  })

  test('listens to events', async () => {
    on.mockImplementation((_event, callback) => callback())

    await service.newRoute(startPosition).catch(() => {})

    expect(on).toBeCalledTimes(4)
    expect(on).toBeCalledWith('connect', expect.any(Function))
    expect(on).toBeCalledWith('disconnect', expect.any(Function))
    expect(on).toBeCalledWith('congrats', expect.any(Function))
    expect(on).toBeCalledWith('changeRequested', expect.any(Function))
  })

  describe('@on.connect', () => {
    beforeEach(() => {
      on.mockImplementation((event, callback) => {
        if (event === 'connect' || event === 'congrats') callback()
      })
    })

    test('it emits an event (driver)', async () => {
      await service.newRoute(startPosition)

      expect(emit).toBeCalledTimes(1)
      expect(emit).toBeCalledWith(
        'event',
        JSON.stringify({
          payload,
          type: 'driver',
        })
      )
    })
  })

  describe('@on.changeRequested', () => {
    let id: string
    beforeEach(() => {
      id = 'some-id'

      on.mockImplementation((event, callback) => {
        if (event === 'changeRequested') callback(id)
      })
    })

    test('checks if pending-route exists', async () => {
      await service.newRoute(startPosition)

      expect(routeApi.get).toBeCalledTimes(1)
      expect(routeApi.get).toBeCalledWith(`/pending-route/${id}`)
    })

    test('it emits an event (acceptChange)', async () => {
      await service.newRoute(startPosition)

      expect(emit).toBeCalledTimes(1)
      expect(emit).toBeCalledWith(
        'event',
        JSON.stringify({
          payload: { id },
          type: 'acceptChange',
        })
      )
    })

    test('resolves the promise, after waiting, with socket', async () => {
      const response = await service.newRoute(startPosition)

      expect(sleep).toBeCalledTimes(1)
      expect(sleep).toBeCalledWith(expect.any(Number))

      expect(response).toEqual(genSocket)
    })

    test('if something throws, reject (and closes socket)', async () => {
      ;(routeApi.get as jest.Mock).mockImplementationOnce(() => {
        throw new Error('404')
      })
      emit.mockImplementationOnce(() => {
        throw new Error('emit-error')
      })
      ;(sleep as jest.Mock).mockImplementationOnce(() => {
        throw new Error('sleep-error')
      })

      await service.newRoute(startPosition).catch(() => {})
      expect(genSocket.close, 'routeApi.get-error').toBeCalledTimes(1)
      await service.newRoute(startPosition).catch(() => {})
      expect(genSocket.close, 'emit-error').toBeCalledTimes(2)
      await service.newRoute(startPosition).catch(() => {})
      expect(genSocket.close, 'sleep-error').toBeCalledTimes(3)
      await service.newRoute(startPosition)
      expect(genSocket.close, 'no error').toBeCalledTimes(3)
    })
  })

  describe('@on.congrats', () => {
    beforeEach(() => {
      on.mockImplementation((event, callback) => {
        if (event === 'congrats') callback()
      })
    })

    test('resolves promise', async () => {
      const response = await service.newRoute(startPosition)

      expect(response).toEqual(genSocket)
    })
  })

  describe('@on.disconnect', () => {
    beforeEach(() => {
      on.mockImplementation((event, callback) => {
        if (event === 'disconnect') callback()
      })
    })

    test('rejects the promise, and closes socket', async () => {
      await service.newRoute(startPosition).catch(() => {})
      expect(genSocket.close).toBeCalledTimes(1)
    })
  })
})
