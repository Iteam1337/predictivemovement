const bookingsCache = new Map()
const vehiclesCache = new Map()
const instructionsCache = new Map()
const idMap = new Map()

module.exports = {
  getBooking: (id) => bookingsCache.get(id),
  addBooking: (id, booking) => bookingsCache.set(id, booking),
  setInstructions: (vehicleId, inscructions) =>
    instructionsCache.set(vehicleId, inscructions),
  getInstructions: (vehicleId) => instructionsCache.get(vehicleId),
  addVehicle: (vehicleId, vehicle) => vehiclesCache.set(vehicleId, vehicle),
  getVehicle: (vehicleId) => vehiclesCache.get(vehicleId),
  getVehicleIdFromTelegramId: (telegramId) => idMap.get(telegramId),
  setVehicleIdFromTelegramId: (telegramId, id) => idMap.set(telegramId, id),
}
