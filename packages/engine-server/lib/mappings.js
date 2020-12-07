const toIncomingDestination = ({ time_windows, ...rest }) => ({
  ...rest,
  timeWindows: time_windows,
})

const toIncomingBooking = ({
  assigned_to,
  external_id,
  requires_transport_id,
  pickup,
  delivery,
  ...booking
}) => ({
  ...booking,
  pickup: toIncomingDestination(pickup),
  delivery: toIncomingDestination(delivery),
  assignedTo: assigned_to,
  externalId: external_id,
  requiresTransportId: requires_transport_id,
})

const toIncomingTransport = ({ start_address, end_address, ...transport }) => ({
  ...transport,
  startAddress: start_address,
  endAddress: end_address,
})

const toIncomingPlan = ({ transports, ...plan }) => ({
  ...plan,
  transports: transports.map(toIncomingTransport),
})

module.exports = {
  toIncomingBooking,
  toIncomingPlan,
  toIncomingTransport,
}
