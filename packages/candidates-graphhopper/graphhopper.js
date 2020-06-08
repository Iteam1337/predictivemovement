const axios = require('axios')
if (!process.env.API_KEY) {
  console.error("Graphhopper API key not specified")
  process.exit(1)
}
const URL =
  `https://graphhopper.com/api/1/vrp?key=${process.env.API_KEY}`

const CAR = {
  type_id: 'car',
  capacity: [10],
  profile: 'car',
}

const vehicleTypes = [CAR]

const generateId = () => {
  return Math.floor(Math.random() * 1000000).toString()
}

const toVehicle = ({ id, position }) => {
  return {
    vehicle_id: id.toString(),
    start_address: {
      location_id: generateId(),
      lon: position.lon,
      lat: position.lat,
    },
    return_to_depot: false,
    type_id: 'car',
  }
}

const toShipment = ({ id, pickup, delivery }) => {
  return {
    id: id.toString(),
    name: `pickup and deliver ${id}`,
    pickup: {
      address: {
        location_id: generateId(),
        lon: pickup.lon,
        lat: pickup.lat,
      },
    },
    delivery: {
      address: {
        location_id: generateId(),
        lon: delivery.lon,
        lat: delivery.lat,
      },
    },
    size: [1],
  }
}

const findRoutes = async (vehicles, bookings) => {
  const payload = {
    vehicles: vehicles.map(toVehicle),
    vehicle_types: vehicleTypes,
    shipments: bookings.map(toShipment),
  }
  const response = await axios.post(URL, payload)
  return response.data
}

module.exports = {
  findRoutes,
}
