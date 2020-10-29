import newBookings from './newBookings'
import vehicleInstructions from './vehicleInstructions'
import newVehicles from './newVehicles'

export const register = (): void => {
  newBookings(), vehicleInstructions(), newVehicles()
}
