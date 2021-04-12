const helpers = require('./helpers')

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

const toOutgoingDestination = (destination) =>
  Object.keys(destination).reduce((prev, curr) => {
    switch (curr) {
      case 'timeWindows':
        return destination.timeWindows
          ? { ...prev, time_windows: destination[curr] }
          : { ...prev }
      default:
        return { ...prev, [curr]: destination[curr] }
    }
  }, {})

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
        return {
          ...prev,
          [curr]: {
            ...booking[curr],
            sender: {
              ...booking[curr].sender,
              contact: helpers.normalizePhoneNumber(
                booking[curr].sender.contact
              ),
            },
            recipient: {
              ...booking[curr].recipient,
              contact: helpers.normalizePhoneNumber(
                booking[curr].recipient.contact
              ),
            },
          },
        }
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

const toOutgoingTransport = (transport) =>
  Object.keys(transport).reduce((acc, curr) => {
    switch (curr) {
      case 'earliestStart':
        return { ...acc, earliest_start: transport[curr] }
      case 'latestEnd':
        return { ...acc, latest_end: transport[curr] }
      case 'startAddress':
        return { ...acc, start_address: transport[curr] }
      case 'endAddress':
        return {
          ...acc,
          end_address:
            transport[curr].hasOwnProperty('lon') &&
            transport[curr].hasOwnProperty('lat')
              ? transport[curr]
              : transport['startAddress'],
        }
      case 'metadata':
        return {
          ...acc,
          metadata: {
            ...transport[curr],
            driver: {
              ...transport[curr].driver,
              contact: helpers.changeFormatOnPhoneNumber(
                transport[curr].driver.contact
              ),
            },
          },
        }
      default:
        return { ...acc, [curr]: transport[curr] }
    }
  }, {})

const toIncomingPlanTransport = (transport) =>
  Object.keys(transport).reduce((prev, curr) => {
    switch (curr) {
      case 'booking_ids':
        return { ...prev, bookingIds: transport[curr] }
      case 'start_address':
        return { ...prev, startAddress: transport[curr] }
      case 'end_address':
        return { ...prev, endAddress: transport[curr] }
      case 'earliest_start':
        return { ...prev, earliestStart: transport[curr] }
      case 'latest_end':
        return { ...prev, latestEnd: transport[curr] }
      case 'metadata':
        return { ...prev, [curr]: JSON.parse(transport[curr]) }
      case 'current_route':
        return { ...prev, currentRoute: JSON.parse(transport[curr]) }
      default:
        return { ...prev, [curr]: transport[curr] }
    }
  }, {})

const toIncomingPlan = ({
  transports,
  booking_ids,
  excluded_booking_ids,
  ...plan
}) => ({
  ...plan,
  transports: transports.map(toIncomingPlanTransport),
  bookingIds: booking_ids,
  excludedBookingIds: excluded_booking_ids,
})

module.exports = {
  toIncomingBooking,
  toIncomingPlan,
  toIncomingTransport,
  toOutgoingBooking,
  toOutgoingTransport,
}
