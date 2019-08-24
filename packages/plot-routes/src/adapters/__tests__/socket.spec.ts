import io from 'socket.io-client'

const routeApi = 'http://foo.bar'

jest.mock('socket.io-client')
jest.mock('../../config', () => ({
  routeApi,
}))

import * as adapter from '../socket'

let socketClient: { on: jest.Mock }
beforeEach(() => {
  socketClient = {
    on: jest.fn(),
  }
  ;((io as unknown) as jest.Mock).mockImplementation(() => {
    return socketClient
  })
})

test('it creates a socket-client (and returns it)', () => {
  const socket = adapter.newSocket()

  expect(io).toBeCalledTimes(1)
  expect(io).toBeCalledWith(routeApi)

  expect(socket).toEqual(socketClient)
})

test('it saves all congrats sent (and user can retrieve them)', () => {
  let congratsEvent: any

  socketClient.on.mockImplementation((_event, callback) => {
    congratsEvent = callback
  })

  adapter.newSocket()

  expect(adapter.confirmed()).toEqual(0)
  congratsEvent()
  expect(adapter.confirmed()).toEqual(1)
  congratsEvent()
  expect(adapter.confirmed()).toEqual(2)
})
