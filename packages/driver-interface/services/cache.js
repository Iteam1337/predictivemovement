const bookingsCache = new Map()
const vehiclesCache = new Map()

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

  addVehicle: (id, vehicle) => vehiclesCache.set(id, vehicle),
  getVehicle: (id) => vehiclesCache.get(id),
}
