import redis from '../adapters/redis'
import { Booking, Instruction, Vehicle } from '../types'

const keys = {
  BOOKINGS: 'bookings',
  INSTRUCTIONS: 'instructions',
  INSTRUCTION_GROUPS: 'instruction_groups',
  VEHICLES: 'vehicles',
  VEHICLE_ID_BY_TELEGRAM_ID: 'vehicle-id-by-telegram-id',
  VEHICLE_ID_BY_PHONE_NUMBER: 'vehicle-id-by-phone-nr',
  CURRENTLY_DELIVERING: 'currently_delivering',
  RECEIPT_PHOTOS: 'receipt_photos',
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
    instructionGroups: Instruction[][]
  ): Promise<string> =>
    redis.set(
      `${keys.INSTRUCTIONS}:${vehicleId}`,
      JSON.stringify(instructionGroups)
    ),
  getInstructions: (vehicleId: string): Promise<Instruction[][]> =>
    redis.get(`${keys.INSTRUCTIONS}:${vehicleId}`).then(JSON.parse),
  addVehicle: <T>(vehicleId: string, vehicle: T): Promise<string> =>
    redis.set(`${keys.VEHICLES}:${vehicleId}`, JSON.stringify(vehicle)),
  getVehicle: (vehicleId: string): Promise<Vehicle | null> =>
    redis.get(`${keys.VEHICLES}:${vehicleId}`).then(JSON.parse),
  getVehicleIdByTelegramId: (telegramId: number): Promise<string> =>
    redis.get(`${keys.VEHICLE_ID_BY_TELEGRAM_ID}:${telegramId}`),
  setVehicleIdByTelegramId: (telegramId: number, id: string): Promise<string> =>
    redis.set(`${keys.VEHICLE_ID_BY_TELEGRAM_ID}:${telegramId}`, id),
  getVehicleIdByPhoneNumber: (phoneNumber: string): Promise<string> =>
    redis.get(`${keys.VEHICLE_ID_BY_PHONE_NUMBER}:${phoneNumber}`),
  setVehicleIdByPhoneNumber: (
    phoneNumber: string,
    id: string
  ): Promise<string> =>
    redis.set(`${keys.VEHICLE_ID_BY_PHONE_NUMBER}:${phoneNumber}`, id),
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
      .then(([res]) => JSON.parse(res[1]))
      .then((res) => res || []),

  getInstructionGroup: (id: string): Promise<Instruction[]> =>
    redis
      .get(`${keys.INSTRUCTION_GROUPS}:${id}`)
      .then((res) => JSON.parse(res)),

  setDriverCurrentlyDelivering: (
    telegramId: number,
    bookindIds: string[]
  ): Promise<string> =>
    redis.set(
      `${keys.CURRENTLY_DELIVERING}:${telegramId}`,
      JSON.stringify(bookindIds)
    ),
  setDriverDoneDelivering: (telegramId: number): Promise<number> =>
    redis.del(`${keys.CURRENTLY_DELIVERING}:${telegramId}`),
  getDriverCurrentDelivering: (telegramId: number): Promise<string[]> =>
    redis
      .get(`${keys.CURRENTLY_DELIVERING}:${telegramId}`)
      .then((res) => JSON.parse(res)),
  saveDeliveryReceiptPhoto: (
    bookingIds: string[],
    photoIds: string[]
  ): Promise<string> =>
    redis.set(
      `${keys.RECEIPT_PHOTOS}:${bookingIds.join('-')}`,
      JSON.stringify(photoIds)
    ),
  getDeliveryReceiptPhotos: (bookingIds: string[]): Promise<string[]> =>
    redis
      .get(`${keys.RECEIPT_PHOTOS}:${bookingIds.join('-')}`)
      .then((res) => JSON.parse(res))
      .then((list) => list || []),
}
