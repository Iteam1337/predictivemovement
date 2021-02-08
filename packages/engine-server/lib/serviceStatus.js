const _ = require('highland')

module.exports = {
  /*
    Suggestion:
      - add a function in elixir for readiness (good thing about this is that you can use as a readiness probe from k8s)
      - make rpc call to the readiness elixir function on a timebase and stream the result
  */
  serviceStatus: _([{ status: 'massive-disruption' }, { status: 'ok' }]),
  checkServiceStatus: (cb) => {
    cb({ status: 'massive-disruption' })
  },
}
