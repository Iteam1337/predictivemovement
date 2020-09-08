const bookingsCache = new Map()
const vehiclesCache = new Map()
const instructionsCache = new Map()

module.exports = {
  getBooking: (id) => bookingsCache.get(id),
  removeBooking: (id) => bookingsCache.delete(id),
  addBooking: (id, booking) => bookingsCache.set(id, booking),
  updateBooking: (id, update) => {
    const booking = bookingsCache.get(id)
    bookingsCache.set(id, {
      ...booking,
      ...update,
    })
  },
  setInstructions: (vehicleId, inscructions) =>
    instructionsCache.set(vehicleId, inscructions),
  getInstructions: (vehicleId) => instructionsCache.get(vehicleId),

  addVehicle: (vehicleId, vehicle) => vehiclesCache.set(vehicleId, vehicle),
  getVehicle: (vehicleId) => vehiclesCache.get(vehicleId),
}
