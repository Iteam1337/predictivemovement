const _ = require('highland')
const { receiptsCache } = require('./cache')
const { saveSignature } = require('./adapters/minio')

module.exports = (receipts, callback) => {
  _(receipts.fork()).each(({ receipt }) => {
    saveSignature(receipt)
    callback(receipt)
  })
}
