const osrm = require('../adapters/osrm')

const latLon = ({ lat, lon }) => `${lon},${lat}`

const nearest = async position => {
  const { data } = await osrm.get(`/nearest/v1/driving/${latLon(position)}`)

  return data
}

module.exports = {
  nearest,
}
