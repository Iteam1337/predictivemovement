const { getWeight } = require('../lib/parcel')

describe('parcel', () => {
  it('should return statedMeasurement over assessedMeasurement', () => {
    const data = {
      TrackingInformationResponse: {
        shipments: [
          {
            itemId: '1337',
            statedMeasurement: {
              weight: {
                value: '0.85',
                unit: 'kg',
              },
              length: {
                value: '0.31',
                unit: 'm',
              },
              height: {
                value: '0.17',
                unit: 'm',
              },
              width: {
                value: '0.24',
                unit: 'm',
              },
              volume: {
                value: '0.012',
                unit: 'm3',
              },
            },
            assessedMeasurement: {
              weight: {
                value: '7',
                unit: 'kg',
              },
            },
          },
        ],
      },
    }
    const weight = getWeight(data)
    expect(weight).toBe(0.85)
  })
  it('should return assessedMeasurement if no statedMeasurement was found', () => {
    const data = {
      TrackingInformationResponse: {
        shipments: [
          {
            itemId: '1337',
            assessedMeasurement: {
              weight: {
                value: '7',
                unit: 'kg',
              },
            },
          },
        ],
      },
    }
    const weight = getWeight(data)
    expect(weight).toBe(7)
  })
})
