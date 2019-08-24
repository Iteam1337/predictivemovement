import mockDate from 'mockdate'

const destination = {
  lon: 16.0016,
  lat: 15.0016,
}

jest.mock('../../config', () => ({
  destination,
}))

import * as util from '../genPayload'

afterEach(() => {
  mockDate.reset()
})

it('returns the expected payload', () => {
  mockDate.set('2020-02-20')

  const payload = util.genPayload({
    lat: 20.2,
    lon: 13.37,
  })

  expect(payload).toMatchInlineSnapshot(`
    Object {
      "end": Object {
        "date": "2020-02-20",
        "position": Object {
          "lat": 15.0016,
          "lon": 16.0016,
        },
      },
      "start": Object {
        "date": "2020-02-20",
        "position": Object {
          "lat": 20.2,
          "lon": 13.37,
        },
      },
    }
  `)
})
