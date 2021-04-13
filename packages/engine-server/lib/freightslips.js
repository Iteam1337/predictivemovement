const _ = require('highland')
const { saveFreightslip } = require('./adapters/minio')

module.exports = (freightslips) => {
  _(freightslips.fork()).each((freightslip) => {
    saveFreightslip(freightslip)
  })
}
