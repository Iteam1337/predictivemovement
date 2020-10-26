const severityByEventStatus = (status) => {
  const map = {
    new: 'success',
    assigned: 'success',
    delivered: 'success',
    picked_up: 'success',
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
  severity: severityByEventStatus('new'),
  type: 'transport',
  event: {
    id: transport.id,
    status: 'new',
  },
  transport,
})

module.exports = {
  severityByEventStatus,
  bookingToNotification,
  transportToNotification,
}
