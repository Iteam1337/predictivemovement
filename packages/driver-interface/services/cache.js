const bookingsCache = new Map()

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
  getBookingFromVehicleId: (vehicleId) =>
    Array.from(bookingsCache.values()).find(
      (booking) => booking.assigned_to.id === vehicleId
    ),
}
