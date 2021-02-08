const _ = require('highland')

module.exports = {
  serviceStatus: _(['error']),
  checkServiceStatus: (cb) => {
    cb('error')
  },
}
