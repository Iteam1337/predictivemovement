const _ = require('highland')
const { receiptsCache } = require('./cache')

module.exports = (receipts, callback) => {
  _(receipts.fork()).each(({ receipt }) => {
    receiptsCache.set(receipt.bookingId, receipt)
    callback(receipt.bookingId, receipt.transportId)
  })
}
