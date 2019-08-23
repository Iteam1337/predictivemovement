const config = require('@iteam/config')({
  file: `${__dirname}/../config.json`,
  defaults: {
    port: 3032,
    osrm: 'http://localhost:5000',
    destination: {
      lat: 66.60543,
      lon: 19.82016,
    },
    routeApi: 'http://localhost:3030',
  },
})

module.exports = {
  port: config.get('port'),
  osrm: config.get('osrm'),
  routeApi: config.get('routeApi'),
  destination: config.get('destination'),
}
