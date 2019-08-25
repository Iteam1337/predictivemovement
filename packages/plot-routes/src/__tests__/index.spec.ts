import supertest from 'supertest'

jest.mock('../config', () => ({
  express: {
    port: 9993,
    host: '',
  },
  packageJSON: {
    name: 'test',
    version: '13.37.0-beta-2-final',
  },
}))

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
