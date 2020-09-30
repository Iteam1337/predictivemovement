const redis = require('../adapters/redis')

const keys = {
  BOOKINGS: 'bookings',
  INSTRUCTIONS: 'instructions',
  VEHICLES: 'vehicles',
  VEHICLE_ID_BY_TELEGRAM_ID: 'vehicle-id-by-telegram-id',
}

module.exports = {
  getBooking: (id) => redis.get(`${keys.BOOKINGS}:${id}`).then(JSON.parse),
  addBooking: (id, booking) =>
    redis.set(`${keys.BOOKINGS}:${id}`, JSON.stringify(booking)),
  setInstructions: (vehicleId, instructions) =>
    redis.set(
      `${keys.INSTRUCTIONS}:${vehicleId}`,
      JSON.stringify(instructions)
    ),
  getInstructions: (vehicleId) =>
    redis.get(`${keys.INSTRUCTIONS}:${vehicleId}`).then(JSON.parse),
  addVehicle: (vehicleId, vehicle) =>
    redis.set(`${keys.VEHICLES}:${vehicleId}`, JSON.stringify(vehicle)),
  getVehicle: (vehicleId) =>
    redis.get(`${keys.VEHICLES}:${vehicleId}`).then(JSON.parse),
  getVehicleIdByTelegramId: (telegramId) =>
    redis.get(`${keys.VEHICLE_ID_BY_TELEGRAM_ID}:${telegramId}`),
  setVehicleIdByTelegramId: (telegramId, id) =>
    redis.set(`${keys.VEHICLE_ID_BY_TELEGRAM_ID}:${telegramId}`, id),
}
