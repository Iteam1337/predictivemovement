import supertest, { Test } from 'supertest'
import querystring from 'querystring'
import genRequests from '../services/genRequests'
import hasProp from '../util/hasProp'

jest.mock('../config', () => ({
  express: {
    port: 9993,
    host: '',
  },
  packageJSON: {
    name: 'test',
    version: '13.37.0-beta-2-final',
  },
  count: 5,
  destination: {
    lat: 1337.0147,
    lon: 13.013,
  },
  radiusInKm: 500,
}))

jest.mock('../services/genRequests')

import app from '../index'
import { errorHandler } from '../index'

let errorMock: jest.Mock
let logMock: jest.Mock
beforeEach(() => {
  errorMock = jest.fn()
  logMock = jest.fn()

  console.error = errorMock
  console.log = logMock
})

describe('app routes', () => {
  describe('GET /', () => {
    it('gets a JSON on root-route', async () => {
      const { body } = await supertest(app)
        .get('/')
        .expect(200)

      expect(body).toEqual({
        version: '13.37.0-beta-2-final',
        name: 'test',
      })
    })
  })

  describe('GET /favicon', () => {
    it('gets an empty 200 for /favicon.ico', async () => {
      const { text } = await supertest(app)
        .get('/favicon.ico')
        .expect(200)

      expect(text).toEqual('')
    })
  })

  describe('GET /generate', () => {
    const genRequestsMock = genRequests as jest.Mock
    const genUrl = (params: any): string => {
      const json = {
        wait: hasProp(params, 'wait') && params.wait,
        destination:
          hasProp(params, 'destination') && JSON.stringify(params.destination),
        count: hasProp(params, 'count') && params.count,
      }
      return `/generate?${querystring.stringify(json)}`
    }

    const req = (params: any): Test => supertest(app).get(genUrl(params))

    it('calls the route and dont wait for response', async () => {
      const { text } = await req({ wait: false }).expect(200)

      expect(genRequestsMock).toBeCalledWith({
        center: undefined,
        count: undefined,
      })

      expect(text).toEqual('')
    })

    it('waits for response', async () => {
      const res = [{ lat: 0.01, lon: 0.01 }]
      genRequestsMock.mockResolvedValue(res)

      const { body: firstRequest } = await req({ wait: true }).expect(200)

      const { body: secondRequest } = await req({ wait: 'true' }).expect(200)

      expect(firstRequest).toEqual(res)
      expect(secondRequest).toEqual(res)
    })

    it('parses count-param', async () => {
      await req({ count: 1.1 })
      await req({ count: '2' })
      await req({ count: '2,50' })
      await req({ count: '2.1337' })
      await req({ count: '-1' })
      await req({ count: '400' })

      expect(genRequests).toBeCalledTimes(6)
      expect(genRequests).nthCalledWith(1, { count: 1 })
      expect(genRequests).nthCalledWith(2, { count: 2 })
      expect(genRequests).nthCalledWith(3, { count: 2 })
      expect(genRequests).nthCalledWith(4, { count: 2 })
      expect(genRequests).nthCalledWith(5, { count: 1 })
      expect(genRequests).nthCalledWith(6, { count: 256 })
    })

    it('parses destination-param', async () => {
      await req({ destination: 1.1 })
      await req({ destination: { lat: 0, lon: 24.4 } })
      await req({ destination: { lat: { foo: 'bar' }, lon: 24.4 } })
      await req({ destination: { lat: 'hello', lon: 24.4 } })
      await req({ destination: { lon: 24.4 } })
      await req({ destination: { lat: 2.2, lon: [0] } })
      await req({ destination: { lat: 2.2, lon: '2,5' } })

      expect(genRequests).toBeCalledTimes(7)
      expect(genRequests).nthCalledWith(1, { destination: undefined })
      expect(genRequests).nthCalledWith(2, {
        destination: { lat: 0, lon: 24.4 },
      })
      expect(genRequests).nthCalledWith(3, { destination: undefined })
      expect(genRequests).nthCalledWith(4, { destination: undefined })
      expect(genRequests).nthCalledWith(5, { destination: undefined })
      expect(genRequests).nthCalledWith(6, { destination: undefined })
      expect(genRequests).nthCalledWith(7, { destination: undefined })
    })
  })
})

describe('error-handling', () => {
  test('404 handler', async () => {
    const { text } = await supertest(app)
      .get('/foo-404')
      .expect(404)

    expect(text).toEqual(expect.stringContaining('Cannot GET /foo-404'))
  })

  test('generic error-handler', () => {
    const next = jest.fn()
    const error = new Error('some error')
    error.stack = 'some error stack'
    ;(errorHandler as any)(error, jest.fn(), jest.fn(), next)

    expect(errorMock).toBeCalledWith(error.stack)
    expect(next).toBeCalledWith(error)
  })
})
