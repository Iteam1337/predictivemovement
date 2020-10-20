const getSeverityByEvent = (status) => {
  switch (status) {
    case 'new':
    case 'assigned':
    case 'delivered':
    case 'picked_up':
      return 'success'
    case 'delivery_failed':
      return 'error'
  }
}

const bookingToNotification = (booking) => ({
  severity: getSeverityByEvent(booking.status),
  type: 'booking',
  event: {
    type: 'booking',
    id: booking.id,
    event: booking.status,
  },
  booking,
})

const transportToNotification = (transport) => ({
  /* We currently
   * only have notifications for when a transport
   * has been created, hence the 'success' severity status
   * and the 'new' event.event.
   */
  severity: getSeverityByEvent(booking.status),
  type: 'transport',
  event: {
    type: 'transport',
    id: transport.id,
    event: 'new',
  },
  transport,
})

module.exports = {
  getSeverityByEvent,
  bookingToNotification,
  transportToNotification,
}
