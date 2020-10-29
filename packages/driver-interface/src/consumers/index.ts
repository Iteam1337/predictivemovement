import newBookings from './newBookings'
import vehiclePlan from './vehiclePlan'
import newVehicles from './newVehicles'

export const register = (): void => {
  newBookings()
  vehiclePlan(),
  newVehicles()
}
