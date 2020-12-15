const PhoneNumber = require('awesome-phonenumber')
const { bookingsCache } = require('../lib/cache')
const severityByEventStatus = (status) => {
  const map = {
    new: 'success',
    assigned: 'success',
    delivered: 'success',
    picked_up: 'success',
    new_instructions: 'success',
    delivery_failed: 'error',
    default: 'info',
  }

  return map[status] ?? map.default
}

const bookingToNotification = (booking) => ({
  severity: severityByEventStatus(booking.status),
  type: 'booking',
  event: {
    id: booking.id,
    status: booking.status,
  },
})

const transportToNotification = (transport, event) => ({
  severity: severityByEventStatus(event || transport.status),
  type: 'transport',
  event: {
    id: transport.id,
    status: event || transport.status,
  },
  transportName: transport.metadata?.profile,
})

const changeFormatOnPhoneNumber = (phoneNumber) => {
  let phoneNumberData

  if (phoneNumber.startsWith('+')) {
    phoneNumberData = new PhoneNumber(phoneNumber)
  } else if (phoneNumber.startsWith('07')) {
    phoneNumberData = new PhoneNumber(phoneNumber, 'SE')
  }
  return phoneNumberData.getNumber('e164').replace('+', '')
}

const addActivityAddressInfo = (plan) => ({
  ...plan,
  transports: plan.transports.map((transport) => ({
    ...transport,
    activities: transport.activities.map((activity) => {
      const { id, type } = activity
      let addressWithInfo
      if (id) {
        addressWithInfo = getAddressInfoFromBookingId(type, id)
      } else if (type === 'start') {
        addressWithInfo = transport.startAddress
      } else if (type === 'end') {
        addressWithInfo = transport.endAddress
      }
      return {
        ...activity,
        address: addressWithInfo,
      }
    }),
  })),
})

function getAddressInfoFromBookingId(type, id) {
  booking = bookingsCache.get(id)
  if (type === 'pickupShipment') return booking.pickup
  else return booking.delivery
}

module.exports = {
  severityByEventStatus,
  bookingToNotification,
  transportToNotification,
  changeFormatOnPhoneNumber,
  addActivityAddressInfo,
}
