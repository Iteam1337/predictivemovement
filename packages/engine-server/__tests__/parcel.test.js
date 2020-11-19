const { getWeight, getMeasurements } = require('../lib/parcel')

describe('extract weight', () => {
  const weightPayload = {
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
  it('should return statedMeasurement firstly', () => {
    const weight = getWeight(weightPayload)
    expect(weight).toBe(1)
  })

  it('should return totalWeight secondly', () => {
    delete weightPayload.TrackingInformationResponse.shipments[0].items[0]
      .statedMeasurement
    const weight = getWeight(weightPayload)
    expect(weight).toBe(300)
  })

  it('should return assessedMeasurement 3rd', () => {
    delete weightPayload.TrackingInformationResponse.shipments[0].items[0]
      .statedMeasurement
    delete weightPayload.TrackingInformationResponse.shipments[0].totalWeight
    const weight = getWeight(weightPayload)
    expect(weight).toBe(7)
  })

  it('should return assessedWeight 4th', () => {
    delete weightPayload.TrackingInformationResponse.shipments[0].items[0]
      .statedMeasurement
    delete weightPayload.TrackingInformationResponse.shipments[0].totalWeight
    delete weightPayload.TrackingInformationResponse.shipments[0].items[0]
      .assessedMeasurement
    const weight = getWeight(weightPayload)
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

describe('extract measurements', () => {
  const measurementsPayload = {
    TrackingInformationResponse: {
      shipments: [
        {
          totalVolume: {
            value: '2',
            unit: 'm3',
          },
          assessedVolume: {
            value: '3',
            unit: 'm3',
          },
          items: [
            {
              itemId: '1337',
              statedMeasurement: {
                length: {
                  value: '3',
                  unit: 'm',
                },
                height: {
                  value: '1',
                  unit: 'm',
                },
                width: {
                  value: '2',
                  unit: 'm',
                },
                volume: {
                  value: '0.012',
                  unit: 'm3',
                },
              },
              assessedMeasurement: {
                length: {
                  value: '4',
                  unit: 'm',
                },
                height: {
                  value: '5',
                  unit: 'm',
                },
                width: {
                  value: '6',
                  unit: 'm',
                },
                volume: {
                  value: '0.012',
                  unit: 'm3',
                },
              },
            },
          ],
        },
      ],
    },
  }

  it('should return statedMeasurement firstly', () => {
    const measurements = getMeasurements(measurementsPayload)
    expect(measurements).toBe(2, 1, 3)
  })
  it('should return assessedMeasurement secondly', () => {
    const measurements = getMeasurements(measurementsPayload)
    delete measurementsPayload.TrackingInformationResponse.shipments[0].items[0]
      .statedMeasurement
    expect(measurements).toBe(6, 5, 4)
  })
  it('should round the values', () => {
    const data = {
      TrackingInformationResponse: {
        shipments: [
          {
            items: [
              {
                itemId: '1337',
                statedMeasurement: {
                  length: {
                    value: '0.4',
                    unit: 'cm',
                  },
                  height: {
                    value: '0.5',
                    unit: 'cm',
                  },
                  width: {
                    value: '0.6',
                    unit: 'cm',
                  },
                },
              },
            ],
          },
        ],
      },
    }
    const measurements = getWeight(data)
    expect(measurements).toBe([1, 2, 0])
  })

  it('should convert m to cm', () => {
    const data = {
      TrackingInformationResponse: {
        shipments: [
          {
            items: [
              {
                itemId: '1337',
                statedMeasurement: {
                  length: {
                    value: '4',
                    unit: 'm',
                  },
                  height: {
                    value: '5',
                    unit: 'm',
                  },
                  width: {
                    value: '6',
                    unit: 'm',
                  },
                },
              },
            ],
          },
        ],
      },
    }
    const measurements = getWeight(data)
    expect(measurements).toBe([600, 500, 400])
  })

  it('should convert dm to cm', () => {
    const data = {
      TrackingInformationResponse: {
        shipments: [
          {
            items: [
              {
                itemId: '1337',
                statedMeasurement: {
                  length: {
                    value: '4',
                    unit: 'dm',
                  },
                  height: {
                    value: '5',
                    unit: 'dm',
                  },
                  width: {
                    value: '6',
                    unit: 'dm',
                  },
                },
              },
            ],
          },
        ],
      },
    }
    const measurements = getWeight(data)
    expect(measurements).toBe([60, 50, 40])
  })

  it('should round mm to cm-int', () => {
    const data = {
      TrackingInformationResponse: {
        shipments: [
          {
            items: [
              {
                itemId: '1337',
                statedMeasurement: {
                  length: {
                    value: '435',
                    unit: 'mm',
                  },
                  height: {
                    value: '572',
                    unit: 'mm',
                  },
                  width: {
                    value: '600',
                    unit: 'mm',
                  },
                },
              },
            ],
          },
        ],
      },
    }
    const measurements = getWeight(data)
    expect(measurements).toBe([60, 60, 40])
  })
})
