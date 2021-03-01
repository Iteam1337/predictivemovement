import newBookings from './newBookings'
import vehicleInstructions from './vehicleInstructions'
import newVehicles from './newVehicles'
import deliverySignatures from './deliverySignatures'

export const register = (): void => {
  newBookings(), vehicleInstructions(), newVehicles(), deliverySignatures()
}
