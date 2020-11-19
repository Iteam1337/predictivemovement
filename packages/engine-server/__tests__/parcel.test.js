const { getWeight } = require('../lib/parcel')

describe('extract weight', () => {
  it('should return statedMeasurement over assessedMeasurement', () => {
    const data = {
      TrackingInformationResponse: {
        shipments: [
          {
            itemId: '1337',
            statedMeasurement: {
              weight: {
                value: '1',
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
    expect(weight).toBe(1)
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

  it('should return statedMeasurement', () => {
    const data = {
      TrackingInformationResponse: {
        shipments: [
          {
            itemId: '1337',
            statedMeasurement: {
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

  it('should round the weight', () => {
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
            },
          },
        ],
      },
    }
    const weight = getWeight(data)
    expect(weight).toBe(1)
  })

  it('should convert weight to kg', () => {
    const data = {
      TrackingInformationResponse: {
        shipments: [
          {
            itemId: '1337',
            statedMeasurement: {
              weight: {
                value: '10000',
                unit: 'g',
              },
            },
          },
        ],
      },
    }
    const weight = getWeight(data)
    expect(weight).toBe(10)
  })

  it('should round grams to int', () => {
    const data = {
      TrackingInformationResponse: {
        shipments: [
          {
            itemId: '1337',
            statedMeasurement: {
              weight: {
                value: '1850',
                unit: 'g',
              },
            },
          },
        ],
      },
    }
    const weight = getWeight(data)
    expect(weight).toBe(2)
  })
})
