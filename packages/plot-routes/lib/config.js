const config = require('@iteam/config')({
  file: `${__dirname}/../config.json`,
  defaults: {
    count: 10,
    destination: {
      lat: 66.60543,
      lon: 19.82016,
    },
    osrm: 'http://localhost:5000',
    port: 3032,
    radiusInKm: 100,
    routeApi: 'http://localhost:3030',
  },
})

module.exports = {
  count: config.get('count'),
  destination: config.get('destination'),
  osrm: config.get('osrm'),
  port: config.get('port'),
  radiusInKm: config.get('radiusInKm'),
  routeApi: config.get('routeApi'),
}
