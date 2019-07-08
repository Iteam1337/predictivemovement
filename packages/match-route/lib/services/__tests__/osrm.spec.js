const osrm = require('../osrm')

describe('osrm', () => {
  let extras
  let startPosition
  let endPosition
  beforeEach(() => {
    extras = [
      {
        id: 'B',
        note: 'VÄSTERÅS - FÖRA',
        passenger: 1,
        startDate: '2019-07-08',
        startPosition: {
          lat: 59.623395,
          lon: 16.550762,
        },
        endDate: '2019-07-09',
        endPosition: {
          lat: 56.927817,
          lon: 16.785503,
        },
      },
      {
        id: 'C',
        note: 'NYKÖPING - MÖNSTERÅS',
        passenger: 1,
        startDate: '2019-07-08',
        startPosition: {
          lat: 58.754099,
          lon: 16.984326,
        },
        endDate: '2019-07-09',
        endPosition: {
          lat: 57.036396,
          lon: 16.424137,
        },
      },
      {
        id: 'D',
        note: 'FALUN - KARLSTAD',
        passenger: 1,
        startDate: '2019-07-08',
        startPosition: {
          lat: 60.588046,
          lon: 15.684973,
        },
        endDate: '2019-07-09',
        endPosition: {
          lat: 59.401483,
          lon: 13.466712,
        },
      },
    ]

    const driver = {
      emptySeats: 3,
      note: 'UPPSALA - BORGHOLM',
      start: {
        date: '2019-07-08',
        position: {
          lat: 59.883976,
          lon: 17.652745,
        },
      },
      end: {
        date: '2019-07-09',
        position: {
          lat: 56.870782,
          lon: 16.659287,
        },
      },
    }

    startPosition = driver.start.position
    endPosition = driver.end.position
  })

  describe('bestMatch', () => {
    it('should include passengers within the time-threshold (C)', async () => {
      const result = await osrm.bestMatch({
        startPosition,
        endPosition,
        extras,
      })

      expect(result).toEqual(
        expect.objectContaining({
          stops: expect.arrayContaining([
            expect.objectContaining({
              lat: expect.any(Number),
              lon: expect.any(Number),
            }),
          ]),
          duration: expect.any(Number),
          distance: expect.any(Number),
        })
      )

      // const extra = extras.find(({ note }) => note === 'NYKÖPING - MÖNSTERÅS')
      const extra = extras.find(({ id }) => id === 'C')

      expect(result).toEqual(
        expect.objectContaining({
          stops: expect.arrayContaining([
            startPosition,
            extra.startPosition,
            extra.endPosition,
            endPosition,
          ]),
          duration: 6.136555555555556,
          distance: 519515.4,
        })
      )
    })
  })
})
