const PhoneNumber = require('awesome-phonenumber')

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
  booking,
})

const transportToNotification = (transport, event) => ({
  severity: severityByEventStatus(event || transport.status),
  type: 'transport',
  event: {
    id: transport.id,
    status: event || transport.status,
  },
  transport,
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

module.exports = {
  severityByEventStatus,
  bookingToNotification,
  transportToNotification,
  changeFormatOnPhoneNumber,
}
