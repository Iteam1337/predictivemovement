import redis from '../adapters/redis'
import { Booking, Instruction, Vehicle } from '../types'

const keys = {
  BOOKINGS: 'bookings',
  INSTRUCTIONS: 'instructions',
  INSTRUCTION_GROUPS: 'instruction_groups',
  VEHICLES: 'vehicles',
  VEHICLE_ID_BY_TELEGRAM_ID: 'vehicle-id-by-telegram-id',
}

export default {
  getBooking: (id: string): Promise<Booking> =>
    redis.get(`${keys.BOOKINGS}:${id}`).then(JSON.parse),
  getBookings: (bookingIds: string[]): Promise<Booking[]> =>
    redis
      .mget(...bookingIds.map((bookingId) => `${keys.BOOKINGS}:${bookingId}`))
      .then((bookings: string[]) =>
        bookings.map((booking: string) => JSON.parse(booking))
      ),
  addBooking: (id: string, booking: Booking): Promise<string> =>
    redis.set(`${keys.BOOKINGS}:${id}`, JSON.stringify(booking)),
  setInstructions: (
    vehicleId: string,
    instructions: Instruction[][]
  ): Promise<string> =>
    redis.set(
      `${keys.INSTRUCTIONS}:${vehicleId}`,
      JSON.stringify(instructions)
    ),
  getInstructions: (vehicleId: string): Promise<Instruction[][]> =>
    redis.get(`${keys.INSTRUCTIONS}:${vehicleId}`).then(JSON.parse),
  addVehicle: <T>(vehicleId: string, vehicle: T): Promise<string> =>
    redis.set(`${keys.VEHICLES}:${vehicleId}`, JSON.stringify(vehicle)),
  getVehicle: (vehicleId: string): Promise<Vehicle | null> =>
    redis.get(`${keys.VEHICLES}:${vehicleId}`).then(JSON.parse),
  getVehicleIdByTelegramId: (telegramId: string): Promise<string> =>
    redis.get(`${keys.VEHICLE_ID_BY_TELEGRAM_ID}:${telegramId}`),
  setVehicleIdByTelegramId: (telegramId: string, id: string): Promise<string> =>
    redis.set(`${keys.VEHICLE_ID_BY_TELEGRAM_ID}:${telegramId}`, id),
  setInstructionGroup: (
    id: string,
    instructionGroup: Instruction[]
  ): Promise<string> =>
    redis.set(
      `${keys.INSTRUCTION_GROUPS}:${id}`,
      JSON.stringify(instructionGroup)
    ),
  getAndDeleteInstructionGroup: (id: string): Promise<Instruction[]> =>
    redis
      .pipeline()
      .get(`${keys.INSTRUCTION_GROUPS}:${id}`)
      .del(`${keys.INSTRUCTION_GROUPS}:${id}`)
      .exec()
      .then(([res]) => JSON.parse(res[1])),
}
