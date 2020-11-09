import { connect } from 'amqplib'

export const open = connect(process.env.AMQP_URL || 'amqp://localhost')

export const exchanges = {
  INCOMING_BOOKING_UPDATES: 'incoming_booking_updates',
  OUTGOING_BOOKING_UPDATES: 'outgoing_booking_updates',
  INCOMING_VEHICLE_UPDATES: 'incoming_vehicle_updates',
  OUTGOING_VEHICLE_UPDATES: 'outgoing_vehicle_updates',
}

export const queues = {
  OFFER_BOOKING_TO_TELEGRAM_VEHICLE: 'offer_bookings_to_telegram_vehicles',
  ADD_BOOKING_INFO: 'add_booking_info_in_driver_interface',
  ADD_INSTRUCTIONS_TO_VEHICLE: 'add_instructions_to_vehicle',
  ADD_VEHICLE: 'add_vehicle.driver_interface',
}
