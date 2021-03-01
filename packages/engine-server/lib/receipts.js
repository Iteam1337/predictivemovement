const _ = require('highland')
const { receiptsCache } = require('./cache')
const { saveSignature } = require('./adapters/minio')

module.exports = (receipts, callback) => {
  _(receipts.fork()).each(({ receipt }) => {
    saveSignature(receipt)
    receiptsCache.set(receipt.bookingId, receipt)

    callback(receipt.bookingId, receipt.transportId)
  })
}
