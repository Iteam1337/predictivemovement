const { getWeight } = require('../lib/parcel')

describe('extract weight', () => {
  it('should return statedMeasurement firstly', () => {
    const data = {
      TrackingInformationResponse: {
        shipments: [
          {
            totalWeight: {
              value: '300',
              unit: 'kg',
            },
            assessedWeight: {
              value: '400',
              unit: 'kg',
            },
            items: [
              {
                itemId: '1337',
                statedMeasurement: {
                  weight: {
                    value: '1',
                    unit: 'kg',
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
        ],
      },
    }
    const weight = getWeight(data)
    expect(weight).toBe(1)
  })

  it('should return totalWeight secondly', () => {
    const data = {
      TrackingInformationResponse: {
        shipments: [
          {
            totalWeight: {
              value: '300',
              unit: 'kg',
            },
            assessedWeight: {
              value: '400',
              unit: 'kg',
            },
            items: [
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
        ],
      },
    }
    const weight = getWeight(data)
    expect(weight).toBe(300)
  })

  it('should return assessedMeasurement 3rd', () => {
    const data = {
      TrackingInformationResponse: {
        shipments: [
          {
            assessedWeight: {
              value: '400',
              unit: 'kg',
            },
            items: [
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
        ],
      },
    }
    const weight = getWeight(data)
    expect(weight).toBe(7)
  })

  it('should return assessedWeight 4th', () => {
    const data = {
      TrackingInformationResponse: {
        shipments: [
          {
            assessedWeight: {
              value: '400',
              unit: 'kg',
            },
            items: [
              {
                itemId: '1337',
              },
            ],
          },
        ],
      },
    }
    const weight = getWeight(data)
    expect(weight).toBe(400)
  })

  it('should round the weight', () => {
    const data = {
      TrackingInformationResponse: {
        shipments: [
          {
            items: [
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
            items: [
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
            items: [
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
        ],
      },
    }
    const weight = getWeight(data)
    expect(weight).toBe(2)
  })
})

describe('measurements', () => {
  const data = {
    TrackingInformationResponse: {
      shipments: [
        {
          totalWeight: {
            weight: {
              value: '300',
              unit: 'kg',
            },
          },
          assessedWeight: {
            weight: {
              value: '400',
              unit: 'kg',
            },
          },
          items: [
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
      ],
    },
  }
})
