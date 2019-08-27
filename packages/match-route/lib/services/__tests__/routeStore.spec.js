const routeStore = require('../routeStore')

describe('actual usage', () => {
  it('works, plz', async () => {
    const now = new Date().toISOString().split('T')[0]

    const person1 = {
      passengers: 1,
      startDate: now,
      endDate: now,
      startPosition: { lat: 67.317792, lon: 18.935346 },
      endPosition: { lat: 66.6054, lon: 19.82016 },
    }

    const person2 = {
      passengers: 1,
      startDate: now,
      endDate: now,
      startPosition: { lat: 0, lon: 0 },
      endPosition: { lat: 0, lon: 0 },
    }

    await routeStore.persons.add('person-1', person1)
    await routeStore.persons.add('person-2', person2)

    const result = await routeStore.persons.getClosest(
      { lat: 67.317792, lon: 18.935346 },
      { lat: 66.6054, lon: 19.82016 },
    )

    expect(result).toEqual(expect.arrayContaining([{
      id: 'person-1',
      ...person1,
    }]))
  })
})
