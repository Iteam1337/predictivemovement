const services = require('../../services')
const mocks = require('./mocks')

describe('formatQueryResult', () => {
  test('formats and gives top result', () => {
    const res = services.formatQueryResult(mocks.elasticResponse.body)
    expect(res).toHaveProperty('address')
    expect(res).toHaveProperty('locality')
    expect(res.locality).toBe(mocks.regexResult[0].city)
    expect(res.address.street).toMatch(/Järntorgsg/)
  })
})
