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

const transportToNotification = (transport) => ({
  /* We currently
   * only have notifications for when a transport
   * has been created, hence the 'success' severity status
   * and the 'new' event.status.
   */
  severity: severityByEventStatus(transport.status),
  type: 'transport',
  event: {
    id: transport.id,
    status: transport.status,
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
