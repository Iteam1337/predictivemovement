const toIncomingDestination = ({ time_windows, ...rest }) => ({
  ...rest,
  timeWindows: time_windows,
})

const toIncomingMapping = {
  assigned_to: 'assignedTo',
  external_id: 'externalId',
  requires_transport_id: 'requiresTransportId',
}

const toIncomingBooking = (booking) =>
  Object.keys(booking).reduce((prev, curr) => {
    switch (curr) {
      case 'pickup':
      case 'delivery':
        return { ...prev, [curr]: toIncomingDestination(booking[curr]) }
      default:
        return { ...prev, [toIncomingMapping[curr] || curr]: booking[curr] }
    }
  }, {})

const toOutgoingDestination = ({ timeWindows, ...rest }) => {
  return {
    time_windows: timeWindows,
    ...rest,
  }
}

const toOutgoingBooking = (booking) =>
  Object.keys(booking).reduce((prev, curr) => {
    switch (curr) {
      case 'assignedTo':
        return { ...prev, assigned_to: booking[curr] }
      case 'externalId':
        return { ...prev, external_id: booking[curr] }
      case 'requiresTransportId':
        return { ...prev, requires_transport_id: booking[curr] }
      case 'pickup':
      case 'delivery':
        return { ...prev, [curr]: toOutgoingDestination(booking[curr]) }
      case 'metadata':
        return { ...prev, [curr]: JSON.stringify(booking[curr]) }
      default:
        return { ...prev, [curr]: booking[curr] }
    }
  }, {})

const toIncomingTransport = ({
  start_address,
  end_address,
  earliest_start,
  latest_end,
  booking_ids,
  current_route,
  ...transport
}) => ({
  ...transport,
  bookingIds: booking_ids,
  currentRoute: current_route,
  earliestStart: earliest_start,
  latestEnd: latest_end,
  startAddress: start_address,
  endAddress: end_address,
})

const toIncomingPlan = ({ transports, booking_ids, ...plan }) => ({
  ...plan,
  transports: transports.map(toIncomingTransport),
  bookingIds: booking_ids,
})

module.exports = {
  toIncomingBooking,
  toIncomingPlan,
  toIncomingTransport,
  toOutgoingBooking,
}
