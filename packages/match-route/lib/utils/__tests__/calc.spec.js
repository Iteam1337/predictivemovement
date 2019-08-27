const calc = require('../calc')

const point1 = { lat: 67.317792, lon: 18.935346 }
const point2 = { lat: 66.6054, lon: 19.82016 }
const point3 = { lat: 66.96221, lon: 19.38422 }
const distance = 88.07

describe('#middlePoint', () => {
  it('gets the middle of two points', () => {
    const { lat, lon } = calc.middlePoint(point1, point2)

    expect(lat).toBeCloseTo(point3.lat)
    expect(lon).toBeCloseTo(point3.lon)
  })
})

describe('#distance', () => {
  it('calcs the distance between two points', () => {
    expect(calc.distance(point1, point2)).toBeCloseTo(distance)
    expect(calc.distance(point1, point3)).toBeCloseTo(distance / 2)
    expect(calc.distance(point2, point3)).toBeCloseTo(distance / 2)
  })
})
