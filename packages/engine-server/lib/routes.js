const _ = require('highland')
const helpers = require('./helpers')
const id62 = require('id62').default // https://www.npmjs.com/package/id62
const { bookingsCache, transportsCache, planCache } = require('./cache')
const parcel = require('./parcel')
const {
  toIncomingBooking,
  toIncomingTransport,
  toOutgoingBooking,
} = require('./mappings')

module.exports = (io) => {
  const {
    bookings,
    transports,
    plan,
    createTransport,
    createBooking,
    dispatchOffers,
    publishDeleteBooking,
    publishDeleteTransport,
    publishMoveBooking,
    transportEvents,
    transportLocationUpdates,
    transportNotifications,
    bookingNotifications,
    updateBooking,
    updateVehicle,
  } = require('./engineConnector')(io)

  io.on('connection', function (socket) {
    _.merge([_(bookingsCache.values()), bookings.fork()])
      .map((newBooking) => {
        const oldBooking = bookingsCache.get(newBooking.id)
        bookingsCache.set(newBooking.id, { ...oldBooking, ...newBooking })
        return { ...newBooking, ...oldBooking }
      })
      .map(toIncomingBooking)
      .batchWithTimeOrCount(1000, 1000)
      .errors(console.error)
      .each((bookings) => {
        socket.emit('bookings', bookings)
      })

    _.merge([_(transportsCache.values()), transports.fork()])
      .filter((transport) => transport.id)
      .doto((transport) => {
        transportsCache.set(transport.id, transport)
      })
      .map(toIncomingTransport)
      .batchWithTimeOrCount(1000, 2000)
      .errors(console.error)
      .each((transports) => socket.emit('transports', transports))

    _.merge([_(planCache.values()), plan.fork()])
      .map(({ excludedBookingIds, ...plan }) => ({
        ...plan,
        excludedBookingIds: excludedBookingIds?.map((booking) => {
          const b = bookingsCache.get(booking.id)
          if (!b) return booking
          return {
            ...booking,
            lat: b.pickup.lat,
            lon: b.pickup.lon,
          }
        }),
      }))
      .map(helpers.addActivityAddressInfo)
      .doto((data) => {
        planCache.set('plan', data)
      })
      .each((data) => socket.emit('plan-update', data))

    _(transportLocationUpdates.fork()).each(({ id, location }) => {
      if (!transportsCache.has(id)) return

      const transport = transportsCache.get(id)

      const updatedTransport = {
        ...transport,
        location,
      }

      transportsCache.set(id, updatedTransport)

      return socket.emit('transport-updated', transportLocationUpdate)
    })

    _(bookingNotifications.fork()).each((booking) => {
      socket.emit('notification', helpers.bookingToNotification(booking))
    })

    _(transportEvents.fork()).each(({ id, event }) =>
      socket.emit(
        'notification',
        helpers.transportToNotification({ id }, event)
      )
    )

    _(transportNotifications.fork()).each((transport) => {
      socket.emit('notification', helpers.transportToNotification(transport))
    })

    socket.on('new-booking', (booking) =>
      createBooking(toOutgoingBooking(booking))
    )

    socket.on('dispatch-offers', () => {
      console.log('received message to dispatch offers, from UI')
      dispatchOffers()
    })

    socket.on('create-transport', (params) => {
      const transport = {
        id: params.id || id62(),
        capacity: params.capacity,
        earliest_start: params.earliestStart,
        latest_end: params.latestEnd,
        start_address: params.startPosition,
        end_address:
          params.endPosition.hasOwnProperty('lon') &&
          params.endPosition.hasOwnProperty('lat')
            ? params.endPosition
            : params.startPosition,

        metadata: {
          driver: {
            name: params.driver.name,
            contact: helpers.changeFormatOnPhoneNumber(params.driver.contact),
          },
          profile: params.metadata.profile,
        },
      }

      createTransport(transport)
    })

    socket.on('move-booking', ({ bookingId, transportId }) => {
      publishMoveBooking(bookingId, transportId)
    })

    socket.on('delete-booking', (id) => {
      console.log('about to delete booking: ', id)
      bookingsCache.delete(id)
      publishDeleteBooking(id)
      socket.emit('delete-booking', id)
    })

    socket.on('delete-transport', (id) => {
      transportsCache.delete(id)
      publishDeleteTransport(id)
      socket.emit('transport-deleted', id)
    })

    socket.on('update-booking', (updatedBooking) =>
      updateBooking(toOutgoingBooking(updatedBooking))
    )
    socket.on('update-vehicle', updateVehicle)

    socket.on('search-parcel', async (id) => {
      const response = await parcel.search(id)
      const weight = parcel.getWeight(response)
      const measurements = parcel.getMeasurements(response)

      socket.emit('parcel-info', { weight, measurements })
    })
  })
}
